import 'firebase/auth';
import { logIn } from '../src/components/Firebase/firebase';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({
    user: {
      uid: 'user123', // Mocked UID of the logged-in user
    },
  })),
}));

test('successful login', async() => {
    const email = 'amykaang@gmail.com';
    const password = 'Testing123'
    const userCredential = await logIn(email, password);
    const uid = userCredential.user.uid
    expect(uid).toBe('hyEUFklZfYgm50aHUwGCoOR38Gg2')
})
