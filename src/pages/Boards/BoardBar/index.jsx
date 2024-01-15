import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'


const MENU_STYLES = {
  color:'primary.main',
  bgcolor: 'white',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'primary.main'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
export default function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trelloCustom.boardBoardHeight,
      // display: flex va alignItems: 'center' dung de can giua noi dung theo chieu doc
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={ MENU_STYLES }
          icon={<DashboardIcon />}
          label="Dinh Cong Don"
          clickable
          // onClick={() => {}}
        />
        <Chip
          sx={ MENU_STYLES }
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
          // onClick={() => {}}
        />
        <Chip
          sx={ MENU_STYLES }
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
          // onClick={() => {}}
        />
        <Chip
          sx={ MENU_STYLES }
          icon={<BoltIcon />}
          label="Automation"
          clickable
          // onClick={() => {}}
        />
        <Chip
          sx={ MENU_STYLES }
          icon={<FilterListIcon />}
          label="Filters"
          clickable
          // onClick={() => {}}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />} >Invite</Button>
        <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              fontSize: 16
            }
          }}
        >
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip title='donlangdang'>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}
