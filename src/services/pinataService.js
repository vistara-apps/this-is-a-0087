import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

const pinataClient = axios.create({
  baseURL: PINATA_BASE_URL,
  timeout: 30000,
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_KEY,
  },
});

export const pinataService = {
  // Pin JSON data to IPFS
  async pinJSONToIPFS(jsonData, metadata = {}) {
    try {
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: metadata.name || 'XStore Weaver Data',
          keyvalues: metadata.keyvalues || {}
        },
        pinataOptions: {
          cidVersion: 1
        }
      };

      const response = await pinataClient.post('/pinning/pinJSONToIPFS', data);
      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      throw error;
    }
  },

  // Pin file to IPFS
  async pinFileToIPFS(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: metadata.keyvalues || {}
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataOptions = JSON.stringify({
        cidVersion: 1
      });
      formData.append('pinataOptions', pinataOptions);

      const response = await pinataClient.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      throw error;
    }
  },

  // Pin storefront data to IPFS
  async pinStorefrontData(storefrontData) {
    try {
      const metadata = {
        name: `Storefront: ${storefrontData.name}`,
        keyvalues: {
          type: 'storefront',
          userId: storefrontData.userId,
          createdAt: new Date().toISOString()
        }
      };

      return await this.pinJSONToIPFS(storefrontData, metadata);
    } catch (error) {
      console.error('Error pinning storefront data:', error);
      throw error;
    }
  },

  // Pin product data to IPFS
  async pinProductData(productData) {
    try {
      const metadata = {
        name: `Product: ${productData.title}`,
        keyvalues: {
          type: 'product',
          storefrontId: productData.storefrontId,
          createdAt: new Date().toISOString()
        }
      };

      return await this.pinJSONToIPFS(productData, metadata);
    } catch (error) {
      console.error('Error pinning product data:', error);
      throw error;
    }
  },

  // Get pinned data from IPFS
  async getPinnedData(ipfsHash) {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching pinned data:', error);
      throw error;
    }
  },

  // List all pins for the account
  async listPins(status = 'pinned', limit = 10, offset = 0) {
    try {
      const response = await pinataClient.get('/data/pinList', {
        params: {
          status,
          pageLimit: limit,
          pageOffset: offset
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error listing pins:', error);
      throw error;
    }
  },

  // Unpin data from IPFS
  async unpinData(ipfsHash) {
    try {
      const response = await pinataClient.delete(`/pinning/unpin/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Error unpinning data:', error);
      throw error;
    }
  },

  // Test authentication
  async testAuthentication() {
    try {
      const response = await pinataClient.get('/data/testAuthentication');
      return response.data;
    } catch (error) {
      console.error('Error testing Pinata authentication:', error);
      throw error;
    }
  },

  // Upload image and get IPFS URL
  async uploadImage(imageFile) {
    try {
      const metadata = {
        name: `Image: ${imageFile.name}`,
        keyvalues: {
          type: 'image',
          uploadedAt: new Date().toISOString()
        }
      };

      const result = await this.pinFileToIPFS(imageFile, metadata);
      return result.url;
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  },

  // Create and pin storefront metadata
  async createStorefrontMetadata(storefront, products) {
    try {
      const metadata = {
        name: storefront.name,
        description: storefront.description,
        image: storefront.image || '',
        external_url: storefront.external_url || '',
        attributes: [
          {
            trait_type: 'Creator',
            value: storefront.creator
          },
          {
            trait_type: 'Products Count',
            value: products.length
          },
          {
            trait_type: 'Created Date',
            value: new Date().toISOString().split('T')[0]
          }
        ],
        products: products.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          currency: product.currency,
          image: product.imageUrl
        }))
      };

      return await this.pinJSONToIPFS(metadata, {
        name: `Storefront Metadata: ${storefront.name}`,
        keyvalues: {
          type: 'storefront_metadata',
          storefrontId: storefront.id
        }
      });
    } catch (error) {
      console.error('Error creating storefront metadata:', error);
      throw error;
    }
  },

  // Generate IPFS gateway URL
  generateGatewayUrl(ipfsHash, gateway = 'https://gateway.pinata.cloud') {
    return `${gateway}/ipfs/${ipfsHash}`;
  },

  // Validate IPFS hash format
  isValidIPFSHash(hash) {
    // Basic validation for IPFS hash (CIDv0 and CIDv1)
    const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    const cidv1Regex = /^b[a-z2-7]{58}$/;
    
    return cidv0Regex.test(hash) || cidv1Regex.test(hash);
  }
};

export default pinataService;
