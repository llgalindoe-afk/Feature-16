import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import './AdminPage.css';

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding a new product
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    ropa: false,
    image: null
  });
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Load products
  const fetchProductsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      // Backend returns { success: true, data: [...] }
      setProducts(data.data || data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  // Quick stats
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const averagePrice = totalProducts > 0 
    ? (products.reduce((acc, p) => acc + (p.price || 0), 0) / totalProducts).toFixed(2) 
    : '0.00';

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    
    setError(null);
    setSuccessMsg(null);
    try {
      const result = await deleteProduct(id);
      setSuccessMsg(result.message || 'Producto eliminado con éxito');
      fetchProductsList();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al eliminar el producto');
    }
  };

  // Open modal for add
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      ropa: false,
      image: null
    });
    setIsModalOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  // Open modal for edit
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock || '0',
      ropa: product.ropa || false,
      image: null // Can't easily load existing image file into file input
    });
    setIsModalOpen(true);
    setError(null);
    setSuccessMsg(null);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validation
    if (!formData.name.trim()) return setError('El nombre del producto es obligatorio');
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      return setError('Introduce un precio válido mayor que 0');
    }
    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      return setError('Introduce una cantidad de stock válida (0 o más)');
    }

    setFormSubmitLoading(true);
    try {
      if (editingProduct) {
        // Edit Mode: Backend takes JSON update
        const updatePayload = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          ropa: formData.ropa
        };
        const result = await updateProduct(editingProduct.id, updatePayload);
        setSuccessMsg(result.message || 'Producto actualizado con éxito');
      } else {
        // Add Mode: Backend takes FormData (image upload)
        const postData = new FormData();
        postData.append('title', formData.name); // backend accepts 'title' or 'name'
        postData.append('description', formData.description);
        postData.append('price', formData.price);
        postData.append('stock', formData.stock);
        postData.append('ropa', formData.ropa);
        if (formData.image) {
          postData.append('image', formData.image);
        }

        await createProduct(postData);
        setSuccessMsg('Producto creado con éxito');
      }
      setIsModalOpen(false);
      fetchProductsList();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Error al procesar el producto');
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // Filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterCategory === 'all') return matchesSearch;
    if (filterCategory === 'ropa') return matchesSearch && product.ropa;
    if (filterCategory === 'otros') return matchesSearch && !product.ropa;
    return matchesSearch;
  });

  // Get image URL matching local/production env
  const getImageUrl = (prod) => {
    const url = prod.imageUrl || prod.image;
    if (!url) return 'https://via.placeholder.com/400';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    return `${apiBaseUrl}/${url}`;
  };

  return (
    <section className="admin-container stack-xl">
      <div className="admin-header">
        <div>
          <span className="admin-eyebrow">ADMINISTRACIÓN</span>
          <h2>Panel de Control del Catálogo</h2>
          <p className="admin-subtitle">Gestiona y actualiza los productos disponibles en la tienda</p>
        </div>
        <button className="btn-add-product" onClick={handleOpenAdd}>
          + Añadir Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Productos</span>
          <strong className="stat-value">{totalProducts}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Stock Total Acumulado</span>
          <strong className="stat-value">{totalStock} uds</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Precio Promedio</span>
          <strong className="stat-value">{averagePrice} €</strong>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="alert-message error">
          <span>⚠️ {error}</span>
          <button className="alert-close" onClick={() => setError(null)}>&times;</button>
        </div>
      )}
      {successMsg && (
        <div className="alert-message success">
          <span>✅ {successMsg}</span>
          <button className="alert-close" onClick={() => setSuccessMsg(null)}>&times;</button>
        </div>
      )}

      {/* Filters and List */}
      <div className="panel catalog-panel">
        <div className="catalog-toolbar">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Buscar producto por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-chips">
            <button 
              className={`chip ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              Todos
            </button>
            <button 
              className={`chip ${filterCategory === 'ropa' ? 'active' : ''}`}
              onClick={() => setFilterCategory('ropa')}
            >
              Solo Ropa
            </button>
            <button 
              className={`chip ${filterCategory === 'otros' ? 'active' : ''}`}
              onClick={() => setFilterCategory('otros')}
            >
              Otros
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando productos del catálogo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p className="lead">No se encontraron productos en el catálogo</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        className="admin-product-thumb" 
                      />
                    </td>
                    <td className="font-semibold">{product.name}</td>
                    <td className="text-muted text-truncate">{product.description || '-'}</td>
                    <td>
                      <span className={`badge ${product.ropa ? 'badge-ropa' : 'badge-general'}`}>
                        {product.ropa ? 'Ropa' : 'General'}
                      </span>
                    </td>
                    <td className="font-semibold">{Number(product.price).toFixed(2)} €</td>
                    <td>
                      <span className={`stock-indicator ${product.stock <= 2 ? 'low-stock' : ''}`}>
                        {product.stock ?? 0} uds
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="action-btn edit-btn" 
                        onClick={() => handleOpenEdit(product)}
                      >
                        Editar
                      </button>
                      <button 
                        className="action-btn delete-btn" 
                        onClick={() => handleDelete(product.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content stack-md">
            <div className="modal-header">
              <h3>{editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="stack-md admin-form">
              <div className="form-group">
                <label>Nombre del Producto *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  placeholder="Ej. Sudadera Oversized"
                  required
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  placeholder="Detalles sobre el producto, material, ajuste..."
                  rows="3"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Precio (€) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange}
                    placeholder="29.99"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock *</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleChange}
                    placeholder="10"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="ropa" 
                    checked={formData.ropa} 
                    onChange={handleChange}
                  />
                  <span>¿Es una prenda de vestir (Ropa)?</span>
                </label>
              </div>

              {!editingProduct && (
                <div className="form-group">
                  <label>Imagen del Producto</label>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="file-input"
                  />
                  <p className="file-hint">Formatos soportados: JPG, PNG, WEBP. Subida directa a Cloudinary.</p>
                </div>
              )}

              {editingProduct && (
                <p className="info-hint">Nota: Para cambiar la imagen de un producto existente, debes recrearlo.</p>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={formSubmitLoading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={formSubmitLoading}
                >
                  {formSubmitLoading ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminPage;
