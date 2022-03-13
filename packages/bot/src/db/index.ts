import { TSelection } from '../shared/types';

const register = (data: TSelection) => {
  console.log('REGISTER:');
  console.log(data);
  // post to backend
  // fetch('http://localhost:8080/register', data)
};

export { register };
