---
description: Нормы и правила стилей разработки на проектах
---

# 💻 Проектные код-стили

## 🔤 Переменные

### 📌 Общие правила
1. Используем **camelCase** для именования переменных.
2. Подбираем **осмысленные** имена, отражающие хранимые данные.
3. Boolean переменные или функции начинаем с **is/has**.

```php
$userRole = $this->user->role;
$requestData = $request->getData();
$isAdminUser = $userRole === 'admin';
```

### 🔒 Переменные класса
1. Всегда используем **protected**.
2. Явно указываем **тип данных**.

```php
protected string $userName;
protected string $email;

public function __construct(string $userName, string $email)
{
    $this->userName = $userName;
    $this->email = $email;
}
```

### 🔑 Ключи объектов
Используем **snake_case**:

```php
return [
    'user_role' => $userRole,
    'request_data' => $requestData,
    'is_admin_user' => $isAdminUser,
];
```

### 🔥 Константы
- Всегда **капсом** (`SNAKE_CASE`).
- Обязательно **модификаторы доступа**.

```php
public const USER_ROLE_KEY = 'user_role';
```

---

## 🏗 Функции

### ✅ Основные принципы
1. Используем **camelCase**.
2. Подбираем названия **по смыслу**.
3. Boolean-функции именуем через **is/has**.
4. Следуем схеме **глагол + существительное**.
5. Всегда указываем **тип параметров и возвращаемого значения**.

```php
public function getUserRole(User $user): ?string
{
    return $user->role ?? null;
}
```

---

## 🔀 Операторы ветвления

### ❌ Минимизация логики внутри `if`

```php
// ❌ Плохо
if ($user) {
    // сложная логика
} else {
    throw new Exception;
}
return $user;

// ✅ Хорошо
if (!$user) {
    throw new Exception;
}

// сложная логика
return $user;
```

### ❌ Избегаем вложенных `if` и используем `match`

```php
// ❌ Плохо
function getGradeComment($grade) {
    if ($grade === 'A') return 'Excellent';
    if ($grade === 'B') return 'Good';
    if ($grade === 'C') return 'Average';
    return 'Invalid Grade';
}

// ✅ Хорошо
function getGradeComment($grade) {
    return match ($grade) {
        'A' => 'Excellent',
        'B' => 'Good',
        'C' => 'Average',
        default => 'Invalid Grade',
    };
}
```

---

## 🔍 Архитектурный подход (SOLID)

### 🎯 Основные принципы
1. **S** (Single Responsibility) — один класс = одна задача.
2. **O** (Open/Closed) — классы открыты для расширения, но закрыты для изменения.
3. **D** (Dependency Inversion) — зависимости передаются через интерфейсы.

---

## 🛠 Контроллеры (`Controller`)

- Контроллер **работает только с реквестом** и **возвращает респонс**.
- **Категорически избегаем логики** в контроллере!

```php
class TitlesTableController extends Controller
{
    public function __construct(protected readonly TitlesTableServiceInterface $service) {}

    public function index(): JsonResponse
    {
        try {
            return response()->json($this->service->getTitlesTableData());
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
```

---

## 🏭 Сервисы (`Service`)

- **Содержат бизнес-логику.**
- **Запросы к БД через `Repository`.**

```php
class TitlesTableService implements TitlesTableServiceInterface
{
    public function __construct(protected TitlesTableRepositoryInterface $repository) {}

    public function getTitlesTableData(): array
    {
        return $this->repository->getTitles()->toArray();
    }
}
```

---

## 🔄 UseCase vs Service

- **UseCase** — отвечает за конкретное действие, содержит 1 публичный метод `handle()`.
- **Service** — выполняет логику, переиспользуемую в разных местах.

```php
class CheckCaptchaUseCase
{
    public function handle(?string $token): bool
    {
        return $this->validateCaptcha($token);
    }
}
```

---

## 📦 DTO (Data Transfer Object)

- DTO — это **объект для передачи данных между слоями**.
- Используем `SerializedName` для работы с сериализатором.

```php
#[SerializedName('email')]
protected string $email;
```

---

## 🎭 ENUM

Используем `enum` вместо строковых значений:

```php
enum UserStatus: string
{
    case ACTIVE = 'active';
    case BANNED = 'banned';
}
```

---

## ⚡ Оптимизация

1. **Не оптимизируй преждевременно!**
2. **Смотри на запросы — избегай `N+1`!**
3. **Используй batch-запросы.**

---

## 🚀 Итог

Этот стиль написания кода делает его **читаемым**, **масштабируемым** и **легким в поддержке**.

