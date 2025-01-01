ALTER TABLE splits ALTER COLUMN user_id TYPE uuid USING (user_id::uuid);
