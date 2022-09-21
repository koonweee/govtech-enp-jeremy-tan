import { trpc } from "@/utils/trpc";
import { TextField, Button, Box } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

interface Props {
  onSubmit: (value: string) => void;
}

interface FormValues {
  url?: string;
}

export function URLForm({ onSubmit }: Props): JSX.Element {
  const { mutateAsync: shortenURLMutateAsync, isLoading: shortenURLIsLoading} = trpc.useMutation("shortenURL");
  return (
    <Formik<FormValues>
      initialValues={{
        url: "",
      }}
      onSubmit={async (values) => {
        // call mutation to get shortened url
        const shortenedPath = await shortenURLMutateAsync({url: values.url!});
        onSubmit(shortenedPath);
      }}
      validationSchema={Yup.object({
        url: Yup.string().url().required('URL is required'),
      })}
    >
      {({ values, handleChange, handleSubmit, touched, errors, isValid }) => (
        <form onSubmit={handleSubmit}>
          <Box margin={1}>
            <TextField
              fullWidth
              id="url"
              name="url"
              label="URL to shorten"
              value={values.url}
              onChange={handleChange}
              error={touched.url && Boolean(errors.url)}
              helperText={touched.url && errors.url}
              variant="outlined"
            />
          </Box>
          <Box margin={3}>
            <Button color="primary" variant="outlined" fullWidth type="submit" disabled={!isValid || shortenURLIsLoading}>
              Shorten URL!
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
}
