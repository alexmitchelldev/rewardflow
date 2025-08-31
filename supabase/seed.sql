-- https://stackoverflow.com/questions/76059457/supabase-local-development-seed-users-table

-- create test users
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
            uuid_generate_v4 (),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 1)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            uuid_generate_v4 (),
            id,
            format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );


insert into businesses (
    id,
    name,
    phone,
    address_line1,
    address_line2,
    address_city,
    address_state,
    address_zip_code,
    address_country,
    logo_url,
    description,
    website,
    is_active,
    updated_at
) values (
    (SELECT id FROM auth.users LIMIT 1),
    'RewardFlow Local Test Business',
    '+1-555-123-4567',
    '123 Main St',
    'Suite 100',
    'Westminster',
    'London',
    'SW11 7US',
    'United Kingdom',
    null,
    'We love RewardFlow!',
    'https://rewardflowlocalbusiness.com',
    true,
    now()
);

insert into products (
    business_id,
    name,
    description
) values (
    (SELECT id FROM businesses LIMIT 1),
    'Haircut',
    'Get a free haircut with 10 points.'
);
