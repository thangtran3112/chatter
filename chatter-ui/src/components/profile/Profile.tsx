import { Avatar, Button, Stack, Typography } from '@mui/material';
import { useGetMe } from '../../hooks/useGetMe';
import { UploadFile } from '@mui/icons-material';
import { API_URL } from '../../constants/urls';
import { snackVar } from '../../constants/snack';

const Profile = () => {
  const me = useGetMe();
  const handleFileUpload = async (event: any) => {
    try {
      const formData = new FormData();
      //the 'file' UI key in form field must matched with the Interceptor on backend
      formData.append('file', event.target.files[0]);
      const res = await fetch(`${API_URL}/users/image`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Image upload failed');
      }
      snackVar({ message: 'Image uploaded.', type: 'success' });
    } catch (err) {
      snackVar({ message: 'Error Uploading File.', type: 'error' });
    }
  };
  return (
    <Stack
      spacing={6}
      sx={{
        marginTop: '2.5rem',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h1">{me?.data?.me?.username}</Typography>
      <Avatar sx={{ width: 256, height: 256 }} src={me.data?.me.imageUrl} />
      <Button
        component="label"
        variant="contained"
        size="large"
        startIcon={<UploadFile />}
      >
        Upload Image
        <input type="file" hidden onChange={handleFileUpload} />
      </Button>
    </Stack>
  );
};

export default Profile;
