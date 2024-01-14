import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModelSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as trelloIcon } from '~/assets/trello.svg'
// cái này có thể dùng được ReactComponent as trelloIcon
// yarn add vite-plugin-svgr@^3.2.0 -D
// import svgr from 'vite-plugin-svgr' and add vplugins: [
//     react(),
//     svgr()
//   ], in file vite.config.js
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspace from './Menus/Workspace'
import Recents from './Menus/Recents'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'


export default function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trelloCustom.appBoardHeight,
      // display: flex va alignItems: 'center' dung de can giua noi dung theo chieu doc
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={trelloIcon} inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>Trello</Typography>
        </Box>

        <Workspace />
        <Recents />
        <Starred />
        <Templates />

        <Button variant="outlined">Create</Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id="outlined-search" label="Search..." type="search" size='small'/>
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge color="secondary" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}
