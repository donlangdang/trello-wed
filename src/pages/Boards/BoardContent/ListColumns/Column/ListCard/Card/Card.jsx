import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'


function Card({ temporaryHideMedia }) {
  if (temporaryHideMedia) {
    return (
      <MuiCard sx={{
        cursor: 'pointer',
        boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
        overflow: 'unset'
      }}>
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          <Typography>Card Test 01</Typography>
        </CardContent>
      </MuiCard>
    )
  }
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
      overflow: 'unset'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image="https://scontent.fbmv1-1.fna.fbcdn.net/v/t31.18172-8/28336498_1627948907301782_8483563149858481775_o.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeG_m6CmsD6i6IIpOdw7SVZfmpMRGFShJgCakxEYVKEmAM6p5fK8t-AZpiMjZG9Wq8ZReif4ryxb9i1tcGuYo1Ek&_nc_ohc=G5HyM_pwE9kAX9xOEcd&_nc_ht=scontent.fbmv1-1.fna&oh=00_AfAKg0aykixAj771cJkALqmlVSld3rTiUGmcebz2ffWG9g&oe=65CB270A"
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography>Donlangdang</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        <Button size="small" startIcon={<GroupIcon />}>20</Button>
        <Button size="small" startIcon={<CommentIcon />}>15</Button>
        <Button size="small" startIcon={<AttachmentIcon />}>10</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card