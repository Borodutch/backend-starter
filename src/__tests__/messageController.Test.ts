import LoginController from '@/controllers/login'
import MessageController from '@/controllers/messages'

describe('MessageController', () => {
  describe('getMessage', () => {
    test('should return empty array', async () => {
      const loginController = new LoginController()
      const mockFn = jest.fn(loginController.email)
      const { token } = await loginController.email({
        email: 'test@test.com',
        name: 'user test',
      })
      expect(token).not.toBe('')
      expect(mockFn).toHaveBeenCalled()
      //   const controller = new MessageController()
      //   const messages = await controller.getMessage('')
      //   expect(messages).toEqual([])
    })
  })
})
