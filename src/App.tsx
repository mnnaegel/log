import SplitTimer from './SplitTimer';
import {Box, Stack} from "@mui/material";

function App() {
  return (
    <Stack width="100%" height="100%" alignItems="center">
      <Box m={4}>
        <SplitTimer />
      </Box>
    </Stack>
  )
}

export default App;