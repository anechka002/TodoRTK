import Box from "@mui/material/Box"
import Skeleton from "@mui/material/Skeleton"

export const TasksSkeleton = () => (
  <Box style={{ padding: "8px 0" }}>
    {Array(4)
      .fill(null)
      .map((_, id) => (
        <Box key={id} sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between'}} style={{ gap: "10px" }}>
            <Skeleton width={20} height={40} />
            <Skeleton width={100} height={40} />
            <Skeleton width={100} height={40} />
          </Box>
          <Skeleton width={20} height={40} />
        </Box>
      ))}
  </Box>
)