import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";


export default function HashPage(): JSX.Element {
  const router = useRouter();
  const { hash } = router.query;
  const { mutateAsync: findByHashMutateAsync, isLoading: isMutateAsyncLoading} = trpc.useMutation("findByHash");
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    const doAsync = async () => {
      const linkResult = await findByHashMutateAsync({hash: hash as string});
      if (linkResult) {
        if (linkResult.remainingClicks == null || linkResult.remainingClicks > 0) {
          window.location.href = linkResult.url;
        } else {
          setMessage(`Maximum clicks for ${linkResult.shortenedPath}`);
        }
      } else{
        setMessage("404")
      }
    }
    doAsync();
  }, [findByHashMutateAsync, hash])
  if (isMutateAsyncLoading || typeof window === 'undefined') {
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
  return <div>{message}</div>;
}
