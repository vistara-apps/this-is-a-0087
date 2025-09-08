import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
  // User operations
  async createUser(userData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          x_handle: userData.xHandle,
          email: userData.email,
          stripe_customer_id: userData.stripeCustomerId,
          alchemy_wallet_address: userData.alchemyWalletAddress,
          turnkey_wallet_id: userData.turnkeyWalletId,
          profile_data: userData.profileData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Storefront operations
  async createStorefront(storefrontData) {
    try {
      const { data, error } = await supabase
        .from('storefronts')
        .insert([{
          user_id: storefrontData.userId,
          storefront_url: storefrontData.storefrontUrl,
          name: storefrontData.name,
          description: storefrontData.description,
          branding: storefrontData.branding,
          settings: storefrontData.settings
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating storefront:', error);
      throw error;
    }
  },

  async getStorefrontById(storefrontId) {
    try {
      const { data, error } = await supabase
        .from('storefronts')
        .select(`
          *,
          users (
            x_handle,
            profile_data
          ),
          products (*)
        `)
        .eq('id', storefrontId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching storefront:', error);
      throw error;
    }
  },

  async getStorefrontByUrl(storefrontUrl) {
    try {
      const { data, error } = await supabase
        .from('storefronts')
        .select(`
          *,
          users (
            x_handle,
            profile_data
          ),
          products (*)
        `)
        .eq('storefront_url', storefrontUrl)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching storefront by URL:', error);
      throw error;
    }
  },

  async getUserStorefronts(userId) {
    try {
      const { data, error } = await supabase
        .from('storefronts')
        .select(`
          *,
          products (count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user storefronts:', error);
      throw error;
    }
  },

  // Product operations
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          storefront_id: productData.storefrontId,
          title: productData.title,
          description: productData.description,
          image_url: productData.imageUrl,
          price: productData.price,
          currency: productData.currency,
          external_url: productData.externalUrl,
          x_post_id: productData.xPostId,
          category: productData.category,
          metadata: productData.metadata
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Sales operations
  async createSale(saleData) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          product_id: saleData.productId,
          storefront_id: saleData.storefrontId,
          user_id: saleData.userId,
          amount: saleData.amount,
          currency: saleData.currency,
          payment_method: saleData.paymentMethod,
          transaction_hash: saleData.transactionHash,
          customer_email: saleData.customerEmail,
          customer_data: saleData.customerData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  },

  async getUserSales(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products (
            title,
            image_url
          ),
          storefronts (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user sales:', error);
      throw error;
    }
  },

  // Analytics operations
  async getStorefrontAnalytics(storefrontId, timeRange = '30d') {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));

      const { data, error } = await supabase
        .from('sales')
        .select('amount, currency, created_at, products(title)')
        .eq('storefront_id', storefrontId)
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Process analytics data
      const totalRevenue = data.reduce((sum, sale) => sum + sale.amount, 0);
      const totalSales = data.length;
      
      // Group by date for chart data
      const salesByDate = data.reduce((acc, sale) => {
        const date = new Date(sale.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + sale.amount;
        return acc;
      }, {});

      return {
        totalRevenue,
        totalSales,
        salesByDate,
        rawData: data
      };
    } catch (error) {
      console.error('Error fetching storefront analytics:', error);
      throw error;
    }
  }
};

export default supabaseService;
