import { Card, CardContent, Typography, AspectRatio, Link, Chip } from '@mui/joy'
import { CategoryItem } from '../lib/wooApi'

type CategoryButtonProps = {
  category: CategoryItem
  onClick?: () => void
}

export default function CategoryButton({ category, onClick }: CategoryButtonProps) {
  const { name, image } = category
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
        
      }}
    >
      
      <CardContent sx={{textAlign: 'center'}}>
      <img
          src={image}
          loading="lazy"
          alt=""
          width={"100%"}
        />
          <Link
            overlay
            underline="none"
            href={`/tienda/${category.slug}`}
            sx={{color: 'text.tertiary' }}
            
          >
                
          </Link>
         
      </CardContent>
    </Card>
  )
}