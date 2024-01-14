import React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Settings from '@mui/icons-material/Settings'
import ListItemIcon from '@mui/material/ListItemIcon'
import Logout from '@mui/icons-material/Logout'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PersonAdd from '@mui/icons-material/PersonAdd'

export default function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 30, height: 30 }}
            alt='donlangdang'
            src='https://scontent.fbmv1-1.fna.fbcdn.net/v/t31.18172-8/28336498_1627948907301782_8483563149858481775_o.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7a1959&_nc_eui2=AeG_m6CmsD6i6IIpOdw7SVZfmpMRGFShJgCakxEYVKEmAM6p5fK8t-AZpiMjZG9Wq8ZReif4ryxb9i1tcGuYo1Ek&_nc_ohc=G5HyM_pwE9kAX9xOEcd&_nc_ht=scontent.fbmv1-1.fna&oh=00_AfAKg0aykixAj771cJkALqmlVSld3rTiUGmcebz2ffWG9g&oe=65CB270A'
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem>
          <Avatar sx={{ width: 30, height: 30, mr: 1.5 }}/> Profile
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ width: 29, height: 29, mr: 1.5 }}/> My account
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}
