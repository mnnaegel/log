create table splits (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  start_time bigint not null,
  end_time bigint,
  pessimistic_estimate integer not null,
  state text not null,
  user_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE INDEX idx_splits_user_id ON splits(user_id);
CREATE INDEX idx_splits_start_time ON splits(start_time DESC);