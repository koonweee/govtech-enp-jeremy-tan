import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';


export default function HashPage(): JSX.Element | undefined {
  const router = useRouter();
  const { hash } = router.query;
  const { data: linkResult, isLoading: isLinkQueryLoading} = trpc.useQuery(["findByHash", {hash: hash as string}]);
  if (isLinkQueryLoading || typeof window === 'undefined') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (linkResult) {
    window.location.href = linkResult.url;
  } else {
    return <div>404</div>;
  }
}
