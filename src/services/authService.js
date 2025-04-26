import api from './baseApi'

export const register = async (username, email, roleId, password, confirmPassword) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      roleId,
      password,
      confirmPassword,
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error')
  }
}

// 🔄 updated to use phone instead of email
export const login = async (country_code, phone, password) => {

  // try {
    const response = await api.post('/api/adminauth/login', {
      country_code,
      phone,
      password,
    });
    console.log(response , 'sdfsdf')
    // const { token } = response.data;
    // localStorage.setItem('token', token);
    return response.data;
  // } catch (error) {
  //   throw error.response ? error.response.data : new Error('Network Error');
  // }
}


export const logout = () => {
  localStorage.removeItem('token')
}
0
