import aiohttp
import asyncio

# URL API
login_url = 'http://localhost:8080/api/auth/login'
delete_url = 'http://localhost:8080/humanbeings/11'

# Данные для авторизации
login_data = {
    'login': 'dima_limbo1',
    'password': '1234'
}

async def delete_human(session, headers, i):
    async with session.delete(delete_url, headers=headers) as delete_response:
        if delete_response.status == 204:
            print(f"Request {i+1}: Human deleted successfully")
        else:
            print(f"Request {i+1}: Failed to delete human, Status code: {delete_response.status}")

async def main():
    async with aiohttp.ClientSession() as session:
        # Шаг 1: Выполняем запрос для получения accessToken
        async with session.post(login_url, json=login_data) as response:
            if response.status == 200:
                data = await response.json()
                access_token = data.get('accessToken')

                if not access_token:
                    print("Access token not found in response")
                else:
                    print(access_token)
                    headers = {
                        'Authorization': f'Bearer {access_token}'
                    }

                    # Шаг 2: Отправляем 10 запросов на удаление асинхронно
                    tasks = []
                    for i in range(10):
                        task = delete_human(session, headers, i)
                        tasks.append(task)
                    
                    await asyncio.gather(*tasks)
            else:
                print(f"Failed to log in, Status code: {response.status}")

# Запуск асинхронного кода
asyncio.run(main())
