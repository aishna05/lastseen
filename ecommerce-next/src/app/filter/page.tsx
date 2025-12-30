'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard'; // Adjust path as needed
import { Filter, ChevronDown } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrls: string;
  category: {
    id: number;
    name: string;
  };
  subcategory: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | 'all'>('all');
  
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get current subcategories based on selected category
  const getCurrentSubcategories = (): Subcategory[] => {
    if (selectedCategoryId === 'all') return [];
    const category = categories.find(c => c.id === selectedCategoryId);
    return category?.subcategories || [];
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (selectedCategoryId === 'all') return true;
    if (product.category.id !== selectedCategoryId) return false;
    if (selectedSubcategoryId === 'all') return true;
    return product.subcategory.id === selectedSubcategoryId;
  });

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategoryId === 'all') return 'All Categories';
    return categories.find(c => c.id === selectedCategoryId)?.name || 'Select Category';
  };

  // Get selected subcategory name
  const getSelectedSubcategoryName = () => {
    if (selectedSubcategoryId === 'all') return 'All Subcategories';
    const subcategories = getCurrentSubcategories();
    return subcategories.find(s => s.id === selectedSubcategoryId)?.name || 'Select Subcategory';
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #DFE0DF, #F0F0F0)', 
      minHeight: '100vh', 
      paddingTop: '2rem',
      paddingBottom: '3rem' 
    }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontFamily: '"Cinzel", serif',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#A68D65',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            marginBottom: '0.5rem'
          }}>
            Our Collection
          </h1>
          <p style={{
            fontSize: '0.9rem',
            color: '#8C8C8C',
            letterSpacing: '0.1em'
          }}>
            Discover elegance in every piece
          </p>
        </div>

        {/* Filter Section */}
        <div style={{
          background: '#FFF8EC',
          borderRadius: '18px',
          border: '1px solid #C5C5C5',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          marginBottom: '3rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
        }}>
          {/* Filter Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Filter style={{ width: '24px', height: '24px', color: '#B08B48' }} />
            <h2 style={{
              fontFamily: '"Cinzel", serif',
              fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
              color: '#A68D65',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              margin: 0
            }}>
              Filter Products
            </h2>
          </div>

          {/* Dropdowns Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            
            {/* Category Dropdown */}
            <div style={{ position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#3C3C3C',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}>
                Category
              </label>
              <button
                onClick={() => {
                  setCategoryDropdownOpen(!categoryDropdownOpen);
                  setSubcategoryDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#F0F0F0',
                  border: '1px solid #C5C5C5',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  color: '#3C3C3C',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{getSelectedCategoryName()}</span>
                <ChevronDown 
                  style={{ 
                    width: '18px', 
                    height: '18px',
                    transform: categoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </button>

              {/* Category Dropdown Menu */}
              {categoryDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.5rem',
                  background: '#FFF8EC',
                  border: '1px solid #C5C5C5',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                  zIndex: 100,
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div
                    onClick={() => {
                      setSelectedCategoryId('all');
                      setSelectedSubcategoryId('all');
                      setCategoryDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: selectedCategoryId === 'all' ? '#B08B48' : '#3C3C3C',
                      fontWeight: selectedCategoryId === 'all' ? '600' : '400',
                      background: selectedCategoryId === 'all' ? 'rgba(176, 139, 72, 0.1)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategoryId !== 'all') {
                        e.currentTarget.style.background = 'rgba(176, 139, 72, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategoryId !== 'all') {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    All Categories
                  </div>
                  {categories.map(category => (
                    <div
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setSelectedSubcategoryId('all');
                        setCategoryDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: selectedCategoryId === category.id ? '#B08B48' : '#3C3C3C',
                        fontWeight: selectedCategoryId === category.id ? '600' : '400',
                        background: selectedCategoryId === category.id ? 'rgba(176, 139, 72, 0.1)' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategoryId !== category.id) {
                          e.currentTarget.style.background = 'rgba(176, 139, 72, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategoryId !== category.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategory Dropdown */}
            {selectedCategoryId !== 'all' && getCurrentSubcategories().length > 0 && (
              <div style={{ position: 'relative' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#3C3C3C',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  Subcategory
                </label>
                <button
                  onClick={() => {
                    setSubcategoryDropdownOpen(!subcategoryDropdownOpen);
                    setCategoryDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: '#F0F0F0',
                    border: '1px solid #C5C5C5',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#3C3C3C',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>{getSelectedSubcategoryName()}</span>
                  <ChevronDown 
                    style={{ 
                      width: '18px', 
                      height: '18px',
                      transform: subcategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </button>

                {/* Subcategory Dropdown Menu */}
                {subcategoryDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '0.5rem',
                    background: '#FFF8EC',
                    border: '1px solid #C5C5C5',
                    borderRadius: '12px',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    zIndex: 100,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <div
                      onClick={() => {
                        setSelectedSubcategoryId('all');
                        setSubcategoryDropdownOpen(false);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: selectedSubcategoryId === 'all' ? '#B08B48' : '#3C3C3C',
                        fontWeight: selectedSubcategoryId === 'all' ? '600' : '400',
                        background: selectedSubcategoryId === 'all' ? 'rgba(176, 139, 72, 0.1)' : 'transparent',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSubcategoryId !== 'all') {
                          e.currentTarget.style.background = 'rgba(176, 139, 72, 0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSubcategoryId !== 'all') {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      All Subcategories
                    </div>
                    {getCurrentSubcategories().map(subcategory => (
                      <div
                        key={subcategory.id}
                        onClick={() => {
                          setSelectedSubcategoryId(subcategory.id);
                          setSubcategoryDropdownOpen(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: selectedSubcategoryId === subcategory.id ? '#B08B48' : '#3C3C3C',
                          fontWeight: selectedSubcategoryId === subcategory.id ? '600' : '400',
                          background: selectedSubcategoryId === subcategory.id ? 'rgba(176, 139, 72, 0.1)' : 'transparent',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedSubcategoryId !== subcategory.id) {
                            e.currentTarget.style.background = 'rgba(176, 139, 72, 0.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedSubcategoryId !== subcategory.id) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {subcategory.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Summary */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem 1.25rem',
            background: 'rgba(176, 139, 72, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(176, 139, 72, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{
                fontSize: '0.85rem',
                color: '#A68D65',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>
            {(selectedCategoryId !== 'all' || selectedSubcategoryId !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSelectedSubcategoryId('all');
                }}
                style={{
                  padding: '0.4rem 1rem',
                  background: 'transparent',
                  border: '1px solid #B08B48',
                  borderRadius: '999px',
                  color: '#B08B48',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#B08B48';
                  e.currentTarget.style.color = '#3C3C3C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#B08B48';
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#8C8C8C'
          }}>
            <p style={{ fontSize: '1.1rem' }}>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            maxWidth: '600px',
            margin: '3rem auto',
            padding: '3rem 2rem',
            textAlign: 'center',
            background: '#FFF8EC',
            borderRadius: '18px',
            border: '1px solid #C5C5C5',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
          }}>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.3rem',
              color: '#A68D65',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              No Products Found
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#8C8C8C',
              lineHeight: '1.6'
            }}>
              Try selecting a different category or subcategory to see our products
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}