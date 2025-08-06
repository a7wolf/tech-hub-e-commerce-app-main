import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
} from '@mui/icons-material';
import { productsAPI } from '../api/productsAPI';
import { cartAPI } from '../api/cartAPI';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      const data = response.data;

      // Handle different response structures
      let productData;
      if (data.data) {
        productData = data.data;
      } else {
        productData = data;
      }

      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };



  const addToCart = async () => {
    if (!product) return;

    try {
      await cartAPI.add(product.id, 1);
      // Fallback to localStorage for immediate UI updates
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      // Show success feedback (you could add a snackbar here)
      console.log('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to localStorage only
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (localStorageError) {
        console.error('Error with localStorage:', localStorageError);
      }
    }
  };
  if (loading) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ my: 4 }}>
          <Skeleton variant='rectangular' width='100%' height={400} />
          <Skeleton variant='text' sx={{ fontSize: '2rem', mt: 2 }} />
          <Skeleton variant='text' sx={{ fontSize: '1rem', mt: 1 }} />
          <Skeleton variant='text' width='60%' sx={{ mt: 1 }} />
        </Box>
      </Container>
    );
  }
  if (error || !product) {
    return (
      <Container maxWidth='lg'>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant='h4' gutterBottom>
            {error || 'Product not found'}
          </Typography>
          <Button
            variant='contained'
            onClick={() => navigate('/products')}
            startIcon={<ArrowBack />}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg'>
      <Box sx={{ my: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Info Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              {/* Product Name */}
              <Typography variant='h4' gutterBottom>
                {product.name || 'Unnamed Product'}
              </Typography>

              {/* Category */}
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={
                    product.categoryName ||
                    (product.category && typeof product.category === 'object'
                      ? product.category.name
                      : product.category) ||
                    'No Category'
                  }
                  color='primary'
                  variant='outlined'
                />
              </Box>

              {/* Price */}
              <Typography variant='h5' color='primary' sx={{ mb: 2 }}>
                ${product.price || '0.00'}
                {product.discount > 0 && (
                  <Typography
                    component='span'
                    variant='body2'
                    sx={{
                      ml: 2,
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    $
                    {(
                      parseFloat(product.price) + parseFloat(product.discount)
                    ).toFixed(2)}
                  </Typography>
                )}
              </Typography>

              {/* Stock Status */}
              <Box sx={{ mb: 3 }}>
                <Typography variant='body2' color='text.secondary'>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant='body1' sx={{ mb: 4 }}>
                {product.description || 'No description available.'}
              </Typography>

              {/* Add to Cart Button */}
              <Button
                variant='contained'
                size='large'
                startIcon={<ShoppingCart />}
                onClick={addToCart}
                disabled={product.stock === 0}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Add to Cart
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetails;
