import supabase from '@/lib/supabaseClient';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  options: PollOption[];
  author?: string;
  createdBy: string;
  createdAt: string;
  totalVotes: number;
  settings: {
    allowMultiple: boolean;
    requireLogin: boolean;
    endDate: string | null;
  };
}

// Fetch all polls (public)
export async function fetchPolls() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('polls').select('*').order('created_at', { ascending: false });
  if (error) {
    const details = { code: (error as any)?.code, details: (error as any)?.details, message: (error as any)?.message };
    console.error('Error fetching polls:', error, details);
    if ((error as any)?.message?.toString().includes('Could not find the table') || (error as any)?.code === '42P01') {
      console.error('Supabase table `polls` not found. Run sql/create_polls_table.sql in your Supabase project.');
    }
    return [];
  }
  return (data || []).map((p: any) => ({
    id: p.id,
    question: p.question,
    description: p.description,
    options: p.options || [],
    author: p.author,
    createdBy: p.created_by,
    createdAt: p.created_at,
    totalVotes: p.total_votes || 0,
    settings: p.settings || { allowMultiple: false, requireLogin: false, endDate: null }
  }));
}

// Fetch single poll
export async function fetchPoll(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase.from('polls').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching poll:', error);
    return null;
  }
  return data
    ? {
        id: data.id,
        question: data.question,
        description: data.description,
        options: data.options || [],
        author: data.author,
        createdBy: data.created_by,
        createdAt: data.created_at,
        totalVotes: data.total_votes || 0,
        settings: data.settings || { allowMultiple: false, requireLogin: false, endDate: null }
      }
    : null;
}

// Create a new poll
export async function createPoll(
  question: string,
  description: string,
  options: { text: string }[],
  author: string,
  settings: { allowMultiple: boolean; requireLogin: boolean; endDate: string | null }
) {
  if (!supabase) return { error: new Error('Supabase not configured') };

  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  if (!userId) return { error: new Error('User not authenticated') };

  const pollOptions = options.map((opt, idx) => ({
    id: `${idx + 1}`,
    text: opt.text,
    votes: 0
  }));

  const { data, error } = await supabase.from('polls').insert([
    {
      question,
      description,
      options: pollOptions,
      author,
      created_by: userId,
      total_votes: 0,
      settings
    }
  ]);

  if (error) {
    const details = { code: (error as any)?.code, details: (error as any)?.details, message: (error as any)?.message };
    console.error('Error creating poll:', error, details);
    if ((error as any)?.message?.toString().includes('Could not find the table') || (error as any)?.code === '42P01') {
      console.error('Supabase table `polls` not found. Run sql/create_polls_table.sql in your Supabase project.');
      return { error: new Error('Supabase table `polls` not found. Create the table using sql/create_polls_table.sql') };
    }
    return { error };
  }

  return { data };
}

// Vote on a poll
export async function votePoll(pollId: string, optionIds: string[]) {
  if (!supabase) return { error: 'Supabase not configured' };

  const { data: pollData, error: fetchError } = await supabase
    .from('polls')
    .select('options, total_votes')
    .eq('id', pollId)
    .single();

  if (fetchError) {
    console.error('Error fetching poll:', fetchError);
    return { error: fetchError };
  }

  const options = pollData.options || [];
  let totalVotesInc = 0;

  const updatedOptions = options.map((opt: any) => {
    if (optionIds.includes(opt.id)) {
      opt.votes = (opt.votes || 0) + 1;
      totalVotesInc += 1;
    }
    return opt;
  });

  const { data, error } = await supabase
    .from('polls')
    .update({
      options: updatedOptions,
      total_votes: (pollData.total_votes || 0) + totalVotesInc
    })
    .eq('id', pollId);

  if (error) {
    console.error('Error voting:', error);
    return { error };
  }

  return { data };
}
