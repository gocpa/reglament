---
description: Codestyle.
---

## Переменные

1. Используем исключительно **camelCase**. 
2. Подбираем имена по смыслу, отображаем в названии **хранимые данные**. 
3. Boolean переменные или функции, именуем с использованием слов **is/has**.

```php
$userRole = $this->user->role;
$requestData = $request->getData();
$isAdminUser = $userRole === 'admin';
```

1. Переменные класса указываем с модификатором **protected** и явно указываем тип данных:

```php
protected string $userName;
protected string $email;

public function __construct(string $userName, string $email)
    {
        $this->userName = $userName;
        $this->email = $email;
    }

```

1. Ключи в объектах именуем с использованием **snake_case**:

```php
return [
  'user_role' => $useRole,
	'request_data' => $requestData,
  'is_admin_user' => $isAdminUser
];
```

1. Константы именуем **капсом** и в **snake_case**. Не забываем добавлять **модификаторы доступа:**

```php
public const USER_ROLE_KEY = 'user_role';
```

## Функции

1. Используем исключительно **camelCase;** 
2. Подбираем названия **по смыслу;**  
3. Если возвращаемый тип функции - Boolean именуем с использованием слов **is/has;**
4. Следуем правилу **глагол + существительное;** 
5. Всегда указываем **тип входящих параметров и возращаемый тип функции(избегать возвращаемый тип mixed):** 

```php
getUserRole(User $user): ?string 
{
	return $user->role ?? null;
}
```

## Операторы ветвления

1. **Стараемся минимизировать количества кода внутри if-конструкции:** 

```php
//Пример плохого кода
if($user) {
	//логика
	//логика
	//логика
	//логика
} else {
	throw new Exception;
}
return $user;

//Пример хорошего кода
if(!user) {
	throw new Exception;
}

//логика
//логика
//логика
//логика
return $user;
```

Если сталкиваемся со случаем, где вообще никак не получается вынести логику из тела if, выносим ее в отдельный метод:

```php
if($user) {
  $user = $this->prepareUser($user);
} else {
	throw new Exception;
}
return $user;
```

1. **Категорически избегаем вложенных условий**, строим архитектуру метода так, чтобы их не было; 
2. Избегаем множественных if в одном методе, используем конструкцию **match:** 

```php
//Пример плохого кода
function getGradeComment($grade) {
    if ($grade === 'A') {
        return 'Excellent';
    } elseif ($grade === 'B') {
        return 'Good';
    } elseif ($grade === 'C') {
        return 'Average';
    } elseif ($grade === 'D') {
        return 'Below Average';
    } elseif ($grade === 'F') {
        return 'Fail';
    } else {
        return 'Invalid Grade';
    }
}

//Пример хорошего кода 
function getGradeComment($grade) {
    return match ($grade) {
        'A' => 'Excellent',
        'B' => 'Good',
        'C' => 'Average',
        'D' => 'Below Average',
        'F' => 'Fail',
        default => 'Invalid Grade',
    };
}
```

1. Используем паттерны заменяющие ветвление, там, где это применимо:
    1. Стратегия https://habr.com/ru/articles/552278/
    2. Фабрика https://habr.com/ru/articles/556512/
    3. Цепочка обязанностей https://habr.com/ru/articles/113995/

## Общий архитектурный подход

### SOLID

Используем принципы SOLID при построении архитектуры. Особое внимание обращаем на:

1. **S(Single Responsibility Principle) - принцип единственной ответственности**. Каждый класс должен иметь только одну зону ответственности, отвечать за одну конкретную поставленную задачу
2. **O(Open closed Principle) - принцип открытости-закрытости.** Классы должны быть открыты для расширения, но закрыты для изменения. Нужно избегать ситуаций, когда вы изменяете существующие методы классов. Для того чтобы добавить новый функционал, вы должны их только расширять. 
3. **D(Dependency Inversion Principle) - принцип инверсии зависимостей.** Если один класс использует другой, нужно передавать его через конструктор, используя сервис-контракты. 

### Функции и методы

Все логические блоки кода, разбиваем на методы:

```php
//Пример плохого кода 
public function superPuperFunction() 
{
	//Забираем данные
	//код
	//код
	//код
	//код
	//Выполняем логические расчеты
	//код
	//код
	//код
	//пакуем данные
	//код
	//код
	//код
	//код
	//код
	return $data;
}

//Пример хорошего кода 

public function buldRequestData()  
{
		$this->getData();
		$this->processData();
		return $this->packData();
{

protected function getData();
protected function processData();
protected function packData();
```

Это позволит нам полностью избавиться от комментариев в коде, вместо комментария у нас названия функции, прочитав которое ты поймешь цепочку действий;

### **Controller**

В этом месте происходит работа с реквестом и возврат респонса или view модели. Категорически избегаем логики в методах контроллера: 

```php
namespace App\Http\Controllers\Advertiser\Titles;

use App\Http\Controllers\Controller;
use App\Service\Titles\TitlesTable\TitlesTableServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TitlesTableController extends Controller
{
    public function __construct(protected readonly TitlesTableServiceInterface $service)
    {
    }

    public function index(): JsonResponse
    {
        try {
            $data = $this->service->getTitlesTableData();

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
```

### **Service**

Это место для вашей логики. Категорически избегаем открытых запросов в базу в сервисах, для этого используем RepositoryClass:

```php
<?php

namespace App\Service\Titles\TitlesTable;

interface TitlesTableServiceInterface
{
    const TITLE_MAPPING = [
        'dc' => 'Дебетовая карта',
        'cc' => 'Кредитная карта',
        'pl' => 'Кредит наличными',
        'sme' => 'РКО',
        'ml' => 'Ипотека',
    ];

    public function getTitlesTableData(): array;

    public function store(array $rows, string $table): void;
}

<?php

namespace App\Service\Titles\TitlesTable;

use App\Repositories\Titles\TitlesTable\TitlesTableRepositoryInterface;

class TitlesTableService implements TitlesTableServiceInterface
{
    public function __construct(protected readonly TitlesTableRepositoryInterface $repository)
    {
    }

    public function getTitlesTableData(): array
    {
        return $this->buildReturnData(
            $this->repository->getRuleTableData()->toArray(),
            $this->repository->getTitles()->toArray()
        );
    }

    protected function buildReturnData(array $ruleTableData, array $titles): array
    {
        $offerSelectData = $this->prepareOfferSelectData($ruleTableData);

        return [
            'tables' => $offerSelectData,
            'titles' => array_map([$this, 'mapTitles'], $titles),
        ];
    }

    protected function mapTitles($item): array
    {
        $item['text'] = self::TITLE_MAPPING[$item['text']] ?? $item['text'];

        return (array) $item;
    }

    protected function prepareOfferSelectData(array $ruleTableData): array
    {
        $offerSelectData = [];

        foreach ($ruleTableData as $item) {
            $id = $item['title_id'];
            $text = $item['text'];

            $item['title'] = [
                'id' => $id,
                'text' => self::TITLE_MAPPING[$text] ?? $text,
            ];

            $offerSelectData[$item['type']][] = $item;
        }

        return $offerSelectData;
    }
}
```

### UseCase

UseCase - класс, содержащий в себе бизнес-логику. В идеале не должен брать на себя более одной ответственности (не должен иметь более одной бизнес-причины изменять класс). Должен содержать в себе 1 публичный метод handle().
Допускается создание других непубличных методов.

```php
<?php

declare(strict_types=1);

namespace App\UseCases\Auth;

use Illuminate\Support\Facades\Log;

class CheckCaptchaUseCase
{
    public function handler(?string $token): bool
    {
        $secretKey = config('captcha.secret_id');
        $captchaId = config('captcha.id');

        if (! $secretKey || ! $captchaId) {
            return true;
        }

        try {
            $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$token}");
        } catch (\Exception $e) {
            Log::error('Ошибка при при проверке capcha: '.$e->getMessage());

            return false;
        }

        $result = json_decode($response);

        return (bool) $result->success;
    }
}

```

Отличия **UseCase** от **Repository:**

1. **Use Case (случай использования)**:
    - Use Case ориентирован на конкретные сценарии использования или действия, которые выполняются в приложении.
    - Он обычно содержит всю бизнес-логику, необходимую для выполнения определенного сценария использования или операции.
    - Use Case иногда используется для описания более высокоуровневых аспектов бизнес-процессов и взаимодействия с конечными пользователями или внешними системами.
2. **Service (сервис)**:
    - Сервис обычно является более общим и универсальным компонентом, предоставляющим определенные функциональные возможности или операции.
    - Он может содержать бизнес-логику, которая не специфична для конкретного сценария использования, а может быть повторно использована в различных частях приложения.
    - Сервисы могут быть более абстрактными и общими, чем Use Case, и часто используются для выполнения операций, которые могут быть вызваны из различных контекстов приложения.

Таким образом, ключевое отличие между Use Case и Service заключается в том, что Use Case более специфичен и ориентирован на определенные сценарии использования, в то время как Service обычно более общий и универсальный, позволяя повторно использовать функциональность в различных контекстах.

### **Repostitory**

Храним методы обращения к базе данных: 

```php
<?php

namespace App\Repositories\Titles\TitlesTable;

use Illuminate\Support\Collection;

interface TitlesTableRepositoryInterface
{
    public function getTitles(): Collection;

    public function getRuleTableData(): Collection;
}

<?php

namespace App\Repositories\Titles\TitlesTable;

use App\Models\Offer;
use App\Models\TitlesRule;
use Illuminate\Support\Collection;

class TitlesTableRepository implements TitlesTableRepositoryInterface
{
    public function getTitles(): Collection
    {
        return Offer::select('id', 'product_name as text')->distinct()->get();
    }

    public function getRuleTableData(): Collection
    {
        return TitlesRule::join('offers', 'titles_rule.title_id', '=', 'offers.id')
            ->select('titles_rule.*', 'offers.product_name as text')
            ->distinct()
            ->get();
    }
}
```

### DTO

DTO представляют собой объекты, которые используются для передачи данных между различными компонентами вашего приложения, например, между контроллерами и сервисами или между слоями приложения.

Они часто используются для объединения нескольких полей в единый объект, что упрощает передачу данных и уменьшает количество параметров в методах.

DTO обычно являются простыми структурами данных без какой-либо бизнес-логики и методов. Они имеют поля данных и геттеры/сеттеры для работы с ними.

Каждому свойству необходимо указать описание атрибута SerializedName для последующей работы с сериализатором. Значение должно быть написано в snake_case

```php
#[SerializedName('generation')]
protected int $generation;
```

Чаще всего Dto создаются как отражение полей таблицы в базе данных.

```php
namespace App\DTO;

class UserDTO
{
    #[SerializedName('name')]
    protected string $name;
    
    #[SerializedName('email')]
    protected string $email;
    
    public function __construct(string $name, string $email)
    {
        $this->name = $name;
        $this->email = $email;
    }
   
    public function getName(): string
    {
        return $this->name;
    }
    
    public function getEmail(): string
    {
        return $this->email;
    }
    
    public function setName(string $name)
    {
        $this->name = $name;
    }
    
    public function setEmail(string $email)
    {
        $this->email = $email;
    }
}
```

Использование dto в паре с serializer.

Преобразование массива в dto:

```php
$userArray = [
		'name' => 'Ivan',
		'email' => 'ivan@example.com'
];

$userDto = $this->serializer->denormalize($userArray, UserDTO::class);
```

Преобразование dto в массив:

```php
$dto = new UserDTO();
$dto->setName('Ivan');
$dto->setEmail('ivan@example.com');

$userArray = $this->serializer->normalize($dto, 'array');
```

### ENUM

Enum (перечисление) - это тип данных, который позволяет определить набор именованных констант. Он представляет собой способ организации связанных значений в более читаемую и управляемую структуру. Enums полезны, когда у вас есть набор конкретных значений, которые могут быть атрибутированы одному и тому же типу.

Enums могут использоваться для определения констант, которые представляют различные состояния, роли, типы и т. д. Они помогают уменьшить вероятность ошибок при написании кода, так как они ограничивают возможные значения переменных.

```php
<?php

declare(strict_types=1);

namespace App\Enums;

use App\Interfaces\LocalizedEnum;

enum LetterStyle: string implements LocalizedEnum
{
    case FORMAL = 'formal';
    case INFORMAL = 'informal';

    public function toLocalizedString(): string
    {
        return match ($this) {
            self::FORMAL => 'Формальный стиль общения',
            self::INFORMAL => 'Неформальный стиль общения',
        };
    }

    /**
     * Возвращает массив в формате ключ-значение.
     */
    public static function forSelect(): array
    {
        $items = [];
        foreach (self::cases() as $case) {
            $items[$case->value] = $case->toLocalizedString();
        }

        return $items;
    }
}

```

Если для какого-то свойства создан enum, избегаем использования этого свойства без enum, будь то:

1. Запрос

```php
$this->user::query()
            ->where('status', '<>', UserStatusEnum::POSTPONED)
            ->where('agent_type', '=', UserOnboardingTypeEnum::SELF_EMPLOYED)
            ->get();
```

1. Проверка

```php
$user->status == UserStatusEnum::POSTPONED->value
```

1. Валидация

```php
Rule::in(array_column(ServiceDeskTaskTypeEnum::cases(), 'value'));
```

### Request

Request классы используются для обработки входящих HTTP запросов. Они предоставляют удобный способ работы с данными, отправляемыми клиентом на сервер. Request классы играют важную роль в валидации данных, аутентификации, авторизации и других аспектах обработки запросов в приложении.

Вот несколько ключевых моментов, связанных с Request классами в Laravel:

1. **Использование Request классов**:
    - Request классы создаются для каждого HTTP запроса, который отправляется на сервер Laravel.
    - Они доступны в контроллерах, маршрутах и других частях вашего приложения для обработки входящих данных.
    - Вы можете создать собственные Request классы для обработки определенных типов запросов или операций.
2. **Валидация данных**:
    - Request классы предоставляют методы для валидации входящих данных.
    - Laravel предоставляет удобный механизм для определения правил валидации непосредственно в классе Request.
3. **Доступ к данным запроса**:
    - Request классы предоставляют удобные методы для доступа к различным аспектам запроса, таким как параметры маршрута, данные формы, заголовки и т.д.
    - Эти данные доступны через методы, такие как **`input()`**, **`query()`**, **`get()`**, **`post()`**, **`file()`**, **`header()`**, и т.д.
4. **Взаимодействие с сеансами и пользователями**:
    - Request классы позволяют получить доступ к сессии и данным аутентификации пользователя (если пользователь аутентифицирован).
    - Это позволяет управлять состоянием и осуществлять различные проверки аутентификации и авторизации.

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Метод authorize определяет, может ли пользователь выполнять данное действие
    }

    public function rules()
    {
        return [
            'title' => 'required|max:255',
            'body' => 'required',
        ];
    }
}
```

### Worker-ы

Job классы представляют собой способ организации долгосрочных и/или асинхронных задач в вашем приложении. Они используются для выполнения фоновых операций, которые могут занимать длительное время или требуют асинхронного выполнения, чтобы не блокировать основной поток исполнения вашего приложения.

1. **Что такое Job классы**:
    - Job классы представляют собой классы, которые реализуют интерфейс **`Illuminate\Contracts\Queue\ShouldQueue`** и содержат логику для выполнения определенной задачи.
    - Они используются совместно с очередями (Queue) в Laravel для асинхронного выполнения задач.
    - Job классы могут выполняться сразу после создания (синхронно) или помещаться в очередь для выполнения позже (асинхронно).
2. **Когда лучше использовать Job классы**:
    - Job классы полезны, когда у вас есть задачи, которые могут занимать длительное время или могут быть выполнены асинхронно, чтобы не задерживать ответ на запрос пользователя.
    - Они также удобны, когда у вас есть повторяющиеся задачи, которые можно вынести в фоновый процесс для повышения эффективности и масштабируемости вашего приложения.
    - Примеры использования Job классов включают отправку электронных писем, обработку загрузки файлов, обновление больших объемов данных и другие операции, которые могут занимать время.
3. **Преимущества использования Job классов**:
    - **Эффективность**: Job классы позволяют вашему приложению эффективно управлять долгосрочными и потенциально затратными задачами, не блокируя основной поток исполнения.
    - **Масштабируемость**: Они облегчают масштабирование вашего приложения, поскольку задачи могут быть асинхронно распределены по различным рабочим процессам или серверам.
    - **Отслеживаемость**: Laravel предоставляет инструменты для мониторинга выполнения задач в очередях, что облегчает отладку и отслеживание проблем.

```php
class ImportOrderJob implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(private readonly array $order)
    {
    }

    public function handle(ParseOrderUseCase $parseOrderUseCase): void
    {
        try {
            $orderId = $this->importOrder($parseOrderUseCase);
            $message = "Создана заявка id: $orderId";
        } catch (\Exception $e) {
            $message = $e->getMessage();
        }

        logger()->channel('clickhouse_import')->warning($message);
    }
}
```

### Синтаксический сахар

Используем синтаксический сахар php. 

```php
//Вместо 
if($isCorrectData) {
		return $data;
} else {
		return $correctData;
}
//Пишем
return $isCOrrectData ? $data : $correctData;

//---------------------------------------------
// Вместо
$result = isset($value) ? $value : $default;
// Пишем
$result = $value ?? $default;

//---------------------------------------------
// Вместо
$data = [1, 2, 3];
$a = $data[0];
$b = $data[1];
$c = $data[2];
// Пишем
list($a, $b, $c) = $data;
```

Стараемся использовать встроенные методы, map, методы работы с массивами и тд. 

### Важно

Когда мы вызываем в классе методы другого класса, то делаем это через **interface** в котором описываем какие методы точно существуют и их можно безопасно использовать. Это и есть **Service - contract**. Он позволяет избежать ситуаций, при которых мы вызываем несуществующий метод. Laravel при таком подходе оборачивает наш класс в DI-контейнер, что дополнительно будет экономить ресурсы приложения.

## Обработка ошибок

**Обработка ошибок должна быть четкой и информативной**. В случае возникновения ошибок, возвращайте информативные сообщения или исключения, чтобы облегчить отладку и понимание проблемы. Хорошая практика использовать кастомные исключения. 

## Оптимизация

1. **Оптимизируйте код только при необходимости**. Не углубляйтесь в оптимизацию заранее, она может привести к усложнению кода и потере читаемости. 
2. **Избегайте избыточной оптимизации**. Не старайтесь ускорить код, который выполняется очень быстро и редко.
3. **Всегда обращайте внимание на запросы**, избегайте запросов в цикле или слишком большие запросы в базу данных. Используйте **batch**, там где это необходимо. 

## Соблюдение стандартов

**При комите вашего кода запускайте ./pre-comit.sh**. Он проверит ваш код на соответствие стандартам и исправит ошибки форматирования.