'use client'
import { useEffect, useState } from 'react'
import {
    Container,
    Typography,
    Grid,
    Box,
    Checkbox,
    Divider,
    IconButton,
    Sheet,
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Select,
    Option,
    Chip,
    Button,
    List,
    ListItem,
    Modal,
    CardContent,
    Card,
    Input,
} from '@mui/joy'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewListIcon from '@mui/icons-material/ViewList'
import ProductCard from '../../../components/ProductCard'
import { getCategories, ProductItem, SubCategoryItem } from '../../../lib/wooApi'
import { CategoryItem } from '../../../lib/wooApi'
import CategoryGrid from '../../../components/CategoryGrid'
import 'keen-slider/keen-slider.min.css'
import LoadingIndicator from '../../../components/LoadingIndicator'
import { Alert, useMediaQuery } from '@mui/material'
import { ESTAMPADOS } from '../../../lib/constants'
import ClearIcon from '@mui/icons-material/Clear'
import { useProducts } from '@/context/ProductContext'
import { SearchOutlined, TableChartOutlined } from '@mui/icons-material'
import { useDebounce } from '@/hooks/useDebounce'
import { useRouter } from "next/navigation";


interface MainViewProps {
    selectedProduct?: string
}

export default function MainView({ selectedProduct }: MainViewProps) {
    const { products, loaded } = useProducts()
    const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>()
    const [categories, setCategories] = useState<CategoryItem[]>()
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const isMobile = useMediaQuery('(max-width: 600px)')
    const [selectedEstampados, setSelectedEstampados] = useState<string[]>([])
    const [isInStock, setIsInStock] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showTable, setShowTable] = useState(false)
    const [selectedChildren, setSelectedChildren] = useState<SubCategoryItem | null>(null)
    const [selectedFilters, setSelectedFilters] = useState<string>("")
    const [searchValue, setSearchValue] = useState('')
    const debouncedSearchValue = useDebounce(searchValue, 500)
    const [searchResults, setSearchResults] = useState<ProductItem[]>([])
    const router = useRouter();

    useEffect(() => {
        getCategories().then((categories) => setCategories(categories))
    }, [])

    useEffect(() => {
        if (debouncedSearchValue) {
           const searchResults = products?.filter((product: ProductItem) => 
                product.name.toLowerCase().includes(debouncedSearchValue.toLowerCase()) && product.stock > 0
            )
            setSearchResults(searchResults)
        }
    }, [debouncedSearchValue])
    useEffect(() => {
        if (categories && products && selectedProduct) {
            setSelectedCategory(categories.find((category) => category.slug == selectedProduct) || categories[0])
        } else {
            setSelectedCategory(categories?.[0] || null)
        }
    }, [categories, products, selectedProduct])
    useEffect(() => {
        if (selectedCategory?.children.length === 0 && products) {
            let stringsToFilter = [selectedCategory?.name]
            if (selectedCategory?.name === "Outlet") {
                stringsToFilter = ["Outlet", "Fuera de catálogo"]
            }
            if (selectedCategory?.name === "Promocionales") {
                stringsToFilter = ["Promocionales", "Distribuidoras"]
            }
            const filteredProducts = products?.filter((product: ProductItem) =>
                stringsToFilter.some(str => product.categories.toLowerCase().includes(str.toLowerCase()))
                && (isInStock ? product.stock > 0 : product.stock === 0)) || []
            setFilteredProducts(filteredProducts)
            setIsLoading(false)
        }
    }, [selectedCategory, isInStock, products])
    useEffect(() => {
        if (products && selectedChildren) {
            setIsLoading(true)
            let filtered: ProductItem[] = []
            const name = selectedChildren?.name
            console.log(name+111)
            if (selectedChildren?.id !== 0) {
                console.log(name+"aaa")
                if (selectedChildren.noParent) {
                    filtered = products?.filter((product: ProductItem) =>
                        product.name.toLowerCase().includes(name?.toLowerCase() || '')
                        && (isInStock ? product.stock > 0 : product.stock === 0)) || []
                } else {
                    filtered = products?.filter((product: ProductItem) =>
                        selectedChildren.id === product.parent
                        && (isInStock ? product.stock > 0 : product.stock === 0)) || []
                }
            } else {
                if (selectedChildren.noParent) {
                    filtered = products?.filter((product: ProductItem) =>
                        product.name.toLowerCase().includes(name?.toLowerCase() || '')
                        && (isInStock ? product.stock > 0 : product.stock === 0)) || []
                } else {
                    filtered = products?.filter((product: ProductItem) =>
                        product.name.toLowerCase().includes(name?.toLowerCase() || '')
                        && (isInStock ? product.stock > 0 : product.stock === 0)) || []
                }

                console.log(filtered+"aaa")
            }
            if (selectedFilters !== '-') {
                filtered = filtered?.filter((product) => product.name.toLowerCase().includes(selectedFilters.toLowerCase()))
            }
            if (selectedEstampados.length > 0 && filtered) {
                const filteringProducts = selectedEstampados.map((estampado) => filtered?.filter((product) => product.name.toLowerCase().includes(estampado.toLowerCase())))
                setFilteredProducts(filteringProducts.flat().filter((product) => product !== undefined))
            } else {
                setFilteredProducts(filtered)
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 1000)
        }
    }, [selectedChildren, selectedEstampados, isInStock, products, selectedFilters])

    if (!categories || !products || !loaded) return <LoadingIndicator isFullScreen={true} />

    const checkDiscount = (product: ProductItem) => {
        return categories.find((category) => category.name.includes(product.parent_name))?.discount || 0

    }
    const handleChangeEstampados = (
        event: React.SyntheticEvent | null,
        newValue: Array<string> | null,
    ) => {
        console.log(newValue)
        setSelectedEstampados(newValue || [])
    };


    

    return (
        <Container>
            <CategoryGrid categories={categories} onCategoryChange={(category) => {
                setSelectedCategory(category)
                setSelectedEstampados([])
                setSelectedChildren(null)
                setSelectedFilters('-')
            }} />
            <Box sx={{  display: 'flex', position: 'relative', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'white',  gap: 1, minWidth: '220px', justifyContent: 'right', alignItems: 'center', mt: 2 }}>
                <Input placeholder="Buscar en toda la tienda..." size="lg" sx={{ minWidth: '270px' }} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <IconButton variant="soft" color="primary" size="lg">
                    <SearchOutlined />
                </IconButton>
                {debouncedSearchValue && (
                    <Box sx={{border: '1px solid #9e71a7', width: '98%', borderRadius: 2, position: 'absolute', top: 50, right: 0, maxWidth: '650px', minHeight: '600px', height: '100%', backgroundColor: 'white', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
                        <Typography level="h4">
                            {searchResults.length} resultados para "{debouncedSearchValue}"
                        </Typography>
                        <IconButton variant="soft" color="danger" size="lg" onClick={() => setSearchValue('')} sx={{ position: 'absolute', top: 10, right: 10 }}>
                            <ClearIcon />
                        </IconButton>
                        <Grid container spacing={2} sx={{ overflowY: 'auto', height: '100%', p: 0,  maxHeight: '500px' }}>
                            {searchResults.map((product) => (
                                    <ProductCard product={product} viewMode="list" discount={checkDiscount(product)} simple />
                               
                            ))}
                        </Grid>
                    </Box>
                )}
            </Box>
            <Typography level="h3" sx={{ mt: 2, textAlign: 'center', color: '#fff', backgroundColor: '#9e71a7', padding: '10px' }}>{`${selectedCategory?.name} ${selectedChildren ? `- ${selectedChildren.name}` : ''}`}</Typography>
            <Box sx={{ display: 'flex', gap: 4, mt: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
                {/* Filtros laterales */}
                {selectedChildren != null && (
                    <Box sx={{ width: { xs: '100%', sm: 180 }, display: 'flex', flexDirection: 'column', gap: 2 }}>

                        <Accordion sx={{ mb: 2, width: '100%' }} defaultExpanded={!isMobile}>
                            <AccordionSummary>
                                <Typography level="h3" sx={{ mb: 1 }}>
                                    Filtros
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography level="body-sm" sx={{ mt: 2, mb: 1 }}>
                                    Categorías
                                </Typography>
                                {categories.map((cat) => (
                                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }} key={cat.name}>
                                        <Checkbox label={cat.name} checked={selectedCategory?.name === cat.name} onChange={() => {
                                            setSelectedCategory(cat)
                                            setSelectedEstampados([])
                                            setSelectedChildren(null)
                                            setSelectedFilters('-')
                                        }} />
                                    </Box>
                                ))}

                                <Divider sx={{ my: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography level="body-sm" sx={{ mt: 2, mb: 1 }}>
                                        Estampados
                                    </Typography>
                                    {selectedEstampados.length > 0 && <IconButton variant="soft" color="danger" size="sm" onClick={() => setSelectedEstampados([])} sx={{ ml: 1, fontSize: '0.3rem' }}>
                                        <ClearIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>}
                                </Box>
                                <Select
                                    value={selectedEstampados}
                                    multiple
                                    onChange={handleChangeEstampados}
                                    slotProps={{
                                        listbox: {
                                            sx: {
                                                width: '100%',
                                            },
                                        },
                                        button: {
                                            sx: {
                                                // Permite que el botón crezca con el contenido
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                minHeight: 'auto',
                                            },
                                        },
                                    }}
                                    renderValue={(selected) => (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'flex-start',
                                                width: '100%',
                                                padding: '0'
                                            }}
                                        >
                                            {selected.map((selectedOption) => (
                                                <Chip key={selectedOption.value} variant="soft" color="primary" sx={{ mr: 0.5, mb: 0.5 }}>
                                                    {selectedOption.label}
                                                </Chip>
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {ESTAMPADOS.map((estampado) => (
                                        <Option key={estampado} value={estampado}>
                                            {estampado}
                                        </Option>
                                    ))}
                                </Select>


                                <Divider sx={{ my: 2 }} />



                                <Typography level="body-sm" sx={{ mb: 1 }}>
                                    Disponibilidad
                                </Typography>
                                <Checkbox label="En stock" checked={isInStock} onChange={() => setIsInStock(true)} />
                                <Checkbox label="Sin stock" checked={!isInStock} onChange={() => setIsInStock(false)} />
                            </AccordionDetails>

                        </Accordion>



                    </Box>
                )}

                {/* Vista de productos */}
                <Box sx={{ flex: 1, p: 2 }}>
                    {
                        selectedChildren == null && (
                            <Grid container spacing={2}>
                                {selectedCategory?.children.map((child) => (
                                    <Grid xs={12} sm={6} md={4} lg={3} key={child.name}>
                                        <Card
                                            onClick={() => {
                                                setSelectedChildren(child);
                                                setSelectedFilters('-')
                                                setIsLoading(true);
                                                router.push("?category=" + child.slug, undefined);
                                            }}
                                            sx={{
                                                height: '100%', // tarjeta ocupa todo el alto del grid item
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                borderRadius: 3,
                                                boxShadow: 3,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    p: 1,
                                                    flexGrow: 1, // CardContent ocupa todo el espacio disponible
                                                }}
                                            >
                                                <Box
                                                    component="img"
                                                    src={child.image}
                                                    alt={child.name}
                                                    sx={{
                                                        width: '80%',
                                                        height: 150,
                                                        objectFit: 'cover',
                                                        borderRadius: 2,
                                                        mb: 2,
                                                    }}
                                                />
                                                <Typography level="body-md" sx={{ fontWeight: 500, mt: 'auto', textAlign: 'center' }}>
                                                    {child.name}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )
                    }
                    {
                        (selectedCategory?.children.length === 0 || selectedChildren != null) && (
                            <>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2,
                                    }}
                                >

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton variant={viewMode === 'grid' ? 'outlined' : 'soft'} size="sm" onClick={() => setViewMode('grid')}>
                                                <ViewModuleIcon />
                                            </IconButton>
                                            <IconButton variant={viewMode === 'list' ? 'outlined' : 'soft'} size="sm" onClick={() => setViewMode('list')}>
                                                <ViewListIcon />
                                            </IconButton>
                                            {selectedChildren?.filters && (
                                                <Select defaultValue={"-"} value={selectedFilters} onChange={(e, value) => setSelectedFilters(value || '-')}>
                                                    <Option value="-">Todos los productos</Option>
                                                    {selectedChildren?.filters?.options.map((option) => (
                                                        <Option value={option}>{option}</Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </Box>

                                    </Box>
                                </Box>
                            </>
                        )
                    }
                    {!isLoading && filteredProducts?.length === 0 && <Alert severity="warning">No se encontraron productos con los filtros aplicados</Alert>}

                    {viewMode === 'grid' && (selectedCategory?.children.length === 0 || selectedChildren != null) ? <Grid container spacing={2}>
                        {isLoading ? <LoadingIndicator /> : filteredProducts?.map((product: ProductItem) => (
                            <Grid xs={12} sm={4} key={product.sku}>
                                <ProductCard product={product} viewMode={viewMode} discount={checkDiscount(product)} />
                            </Grid>
                        ))}
                    </Grid> : viewMode === 'list' && (selectedCategory?.children.length === 0 || selectedChildren != null) ? <List sx={{ width: '100%' }}>
                        {filteredProducts?.map((product: ProductItem) => (
                            <ListItem key={product.sku} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                                <ProductCard product={product} viewMode={viewMode} discount={checkDiscount(product)} />
                                <Divider />
                            </ListItem>
                        ))}
                    </List> : null}
                </Box>
            </Box>
            {showTable &&
                <Modal open={showTable} onClose={() => setShowTable(false)}>
                    <Sheet
                        sx={{
                            width: { xs: '100%', sm: 500 },
                            mx: 'auto',
                            mt: '3vh',
                            borderRadius: 'md',
                            p: 4,
                            boxShadow: 'lg',
                            bgcolor: 'background.body',
                            outline: 'none',
                            textAlign: 'center',
                        }}
                    >
                        <img
                            src="/imgs/guia.jpg"
                            alt="Tabla de tallas"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                        />
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setShowTable(false)}
                            sx={{ mt: 3 }}
                        >
                            Cerrar
                        </Button>
                    </Sheet>
                </Modal>
            }
        </Container>
    )
}