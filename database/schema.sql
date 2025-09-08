-- XStore Weaver Database Schema
-- This file contains the complete database schema for the XStore Weaver application
-- Run this in your Supabase SQL editor to set up the database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    x_handle VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255),
    alchemy_wallet_address VARCHAR(255),
    turnkey_wallet_id VARCHAR(255),
    profile_data JSONB DEFAULT '{}',
    subscription_status VARCHAR(50) DEFAULT 'free',
    subscription_plan VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storefronts table
CREATE TABLE storefronts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    storefront_url VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    branding JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    ipfs_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    storefront_id UUID REFERENCES storefronts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    external_url TEXT,
    x_post_id VARCHAR(255),
    category VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    ipfs_hash VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales table
CREATE TABLE sales (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    storefront_id UUID REFERENCES storefronts(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL, -- 'stripe', 'crypto'
    transaction_hash VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    customer_email VARCHAR(255),
    customer_data JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'failed', 'refunded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table for tracking storefront visits
CREATE TABLE analytics_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    storefront_id UUID REFERENCES storefronts(id) ON DELETE CASCADE,
    visitor_ip VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- X Posts analysis cache
CREATE TABLE x_posts_analysis (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id VARCHAR(255) NOT NULL,
    post_content TEXT NOT NULL,
    engagement_metrics JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    suggested_products JSONB DEFAULT '[]',
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Subscription plans table
CREATE TABLE subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    billing_interval VARCHAR(20) NOT NULL, -- 'month', 'year'
    features JSONB DEFAULT '{}',
    max_storefronts INTEGER DEFAULT 1,
    max_products_per_storefront INTEGER DEFAULT 10,
    analytics_retention_days INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- 'active', 'canceled', 'past_due', 'unpaid'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks log table for tracking external API calls
CREATE TABLE webhooks_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    source VARCHAR(100) NOT NULL, -- 'stripe', 'x_api', 'turnkey'
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_x_handle ON users(x_handle);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_storefronts_user_id ON storefronts(user_id);
CREATE INDEX idx_storefronts_url ON storefronts(storefront_url);
CREATE INDEX idx_products_storefront_id ON products(storefront_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_storefront_id ON sales(storefront_id);
CREATE INDEX idx_sales_created_at ON sales(created_at);
CREATE INDEX idx_analytics_visits_storefront_id ON analytics_visits(storefront_id);
CREATE INDEX idx_analytics_visits_created_at ON analytics_visits(created_at);
CREATE INDEX idx_x_posts_analysis_user_id ON x_posts_analysis(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_storefronts_updated_at BEFORE UPDATE ON storefronts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE storefronts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE x_posts_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Storefronts policies
CREATE POLICY "Users can view own storefronts" ON storefronts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own storefronts" ON storefronts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own storefronts" ON storefronts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own storefronts" ON storefronts
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Public can view active storefronts
CREATE POLICY "Public can view active storefronts" ON storefronts
    FOR SELECT USING (is_active = true);

-- Products policies
CREATE POLICY "Users can manage own products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM storefronts 
            WHERE storefronts.id = products.storefront_id 
            AND storefronts.user_id::text = auth.uid()::text
        )
    );

-- Public can view active products
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM storefronts 
            WHERE storefronts.id = products.storefront_id 
            AND storefronts.is_active = true
        )
    );

-- Sales policies
CREATE POLICY "Users can view own sales" ON sales
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics_visits
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM storefronts 
            WHERE storefronts.id = analytics_visits.storefront_id 
            AND storefronts.user_id::text = auth.uid()::text
        )
    );

-- X posts analysis policies
CREATE POLICY "Users can manage own x posts analysis" ON x_posts_analysis
    FOR ALL USING (auth.uid()::text = user_id::text);

-- User subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, price, currency, billing_interval, features, max_storefronts, max_products_per_storefront, analytics_retention_days) VALUES
('Basic', 10.00, 'USD', 'month', '{"ai_analysis": true, "basic_analytics": true, "stripe_payments": true}', 1, 10, 30),
('Pro', 25.00, 'USD', 'month', '{"ai_analysis": true, "advanced_analytics": true, "stripe_payments": true, "crypto_payments": true, "custom_branding": true}', 3, 50, 90),
('Enterprise', 99.00, 'USD', 'month', '{"ai_analysis": true, "advanced_analytics": true, "stripe_payments": true, "crypto_payments": true, "custom_branding": true, "priority_support": true, "api_access": true}', 10, 200, 365);

-- Create a function to generate unique storefront URLs
CREATE OR REPLACE FUNCTION generate_storefront_url(base_name TEXT)
RETURNS TEXT AS $$
DECLARE
    clean_name TEXT;
    url_candidate TEXT;
    counter INTEGER := 0;
BEGIN
    -- Clean the base name: lowercase, replace spaces with hyphens, remove special chars
    clean_name := lower(regexp_replace(base_name, '[^a-zA-Z0-9\s]', '', 'g'));
    clean_name := regexp_replace(clean_name, '\s+', '-', 'g');
    clean_name := trim(both '-' from clean_name);
    
    -- If clean_name is empty, use a default
    IF clean_name = '' THEN
        clean_name := 'storefront';
    END IF;
    
    url_candidate := clean_name;
    
    -- Check if URL exists and increment counter if needed
    WHILE EXISTS (SELECT 1 FROM storefronts WHERE storefront_url = url_candidate) LOOP
        counter := counter + 1;
        url_candidate := clean_name || '-' || counter;
    END LOOP;
    
    RETURN url_candidate;
END;
$$ LANGUAGE plpgsql;
