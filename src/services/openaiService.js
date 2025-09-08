import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled by backend
});

export const openaiService = {
  // Analyze tweets to identify potential products/services
  async analyzePostsForProducts(posts) {
    try {
      const postsText = posts.map(post => `Post: ${post.text || post.content}\nLikes: ${post.public_metrics?.like_count || post.likes}\nRetweets: ${post.public_metrics?.retweet_count || post.retweets}`).join('\n\n');
      
      const prompt = `
Analyze the following X (Twitter) posts and identify potential products or services that could be sold based on the content. For each identified opportunity, provide:

1. Product/Service Title
2. Description (2-3 sentences)
3. Suggested price range
4. Category (course, consultation, template, ebook, service, etc.)
5. Confidence score (1-10)

Posts to analyze:
${postsText}

Please respond in JSON format with an array of products:
{
  "products": [
    {
      "title": "Product Title",
      "description": "Product description",
      "priceRange": "$X - $Y",
      "suggestedPrice": X,
      "category": "category",
      "confidence": X,
      "reasoning": "Why this product makes sense based on the post"
    }
  ]
}

Focus on realistic, sellable products that align with the user's expertise and audience engagement.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert business consultant specializing in identifying monetization opportunities from social media content. Analyze posts to suggest realistic products and services."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.products;
    } catch (error) {
      console.error('Error analyzing posts for products:', error);
      throw error;
    }
  },

  // Generate product images using DALL-E
  async generateProductImage(productTitle, productDescription) {
    try {
      const prompt = `Create a professional, clean product image for "${productTitle}". ${productDescription}. Style: modern, minimalist, professional, suitable for an online store. No text overlays.`;
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard"
      });

      return response.data[0].url;
    } catch (error) {
      console.error('Error generating product image:', error);
      // Return a fallback image URL
      return `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop`;
    }
  },

  // Optimize product descriptions for better conversion
  async optimizeProductDescription(title, description, targetAudience = "entrepreneurs and creators") {
    try {
      const prompt = `
Optimize this product description for better conversion rates:

Title: ${title}
Current Description: ${description}
Target Audience: ${targetAudience}

Please provide:
1. An optimized title (if needed)
2. A compelling product description (2-3 sentences)
3. Key benefits (3-4 bullet points)
4. A strong call-to-action

Respond in JSON format:
{
  "optimizedTitle": "title",
  "description": "description",
  "benefits": ["benefit1", "benefit2", "benefit3"],
  "callToAction": "CTA text"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert copywriter specializing in e-commerce product descriptions that convert."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error optimizing product description:', error);
      throw error;
    }
  },

  // Generate storefront copy and branding
  async generateStorefrontCopy(userProfile, products) {
    try {
      const prompt = `
Create compelling storefront copy for a creator's online store:

Creator Profile:
- Handle: ${userProfile.username || userProfile.xHandle}
- Bio: ${userProfile.description || 'Creator and entrepreneur'}
- Followers: ${userProfile.public_metrics?.followers_count || userProfile.followers}

Products: ${products.map(p => p.title).join(', ')}

Please provide:
1. Store tagline (1 sentence)
2. About section (2-3 sentences)
3. Welcome message (1-2 sentences)

Respond in JSON format:
{
  "tagline": "tagline",
  "about": "about section",
  "welcome": "welcome message"
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert brand copywriter creating compelling storefront copy that builds trust and drives sales."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 800
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating storefront copy:', error);
      throw error;
    }
  }
};

export default openaiService;
