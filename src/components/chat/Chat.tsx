import { useParams } from 'react-router-dom';
import { useGetChat } from '../../hooks/useGetChat';

const chat = () => {
  const params = useParams();
  const { data } = useGetChat({ _id: params._id! });
  return <h1>{data?.chat.name}</h1>;
};

export default chat;
