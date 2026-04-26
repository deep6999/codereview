# Code Review System Diagrams

This file contains simple Mermaid diagrams for the main parts of the app:

- Frontend
- Clerk login
- Backend API
- MongoDB history
- AI review service

## 1. Class Diagram

```mermaid
classDiagram
    class FrontendApp {
      +code: string
      +review: string
      +history: List
      +isSignedIn: boolean
      +writeCode()
      +reviewCode()
      +showHistory()
      +clearHistory()
    }

    class Auth {
      +userId: string
      +token: string
      +signIn()
      +getToken()
    }

    class BackendAPI {
      +getReview(code)
      +getHistory(userId)
      +clearHistory(userId)
    }

    class ReviewController {
      +getReview()
      +getHistory()
      +clearHistory()
    }

    class History {
      +id: string
      +userId
      +code
      +review
      +createdAt
    }

    class AIService {
      +generateReview()
    }

    class MongoDB {
      +saveHistory()
      +findHistory()
      +deleteHistory()
    }

    FrontendApp --> Auth
    FrontendApp --> BackendAPI
    BackendAPI --> ReviewController
    ReviewController --> AIService
    ReviewController --> History
    ReviewController --> MongoDB
```

## 2. ER Diagram

```mermaid
erDiagram
    USER ||--o{ HISTORY : has

    USER {
      string clerkUserId PK
    }

    HISTORY {
      string id PK
      string clerkUserId FK
      string code
      string review
      date createdAt
    }
```

## 3. Activity Diagram

```mermaid
flowchart TD
    A[Start] --> B[User writes code]
    B --> C[Click Review Code]
    C --> D[Backend generates review]
    D --> E{User logged in?}
    E -- Yes --> F[Save history in MongoDB]
    E -- No --> G[Skip save]
    F --> H[Show review]
    G --> H[Show review]
```

## 4. Use Case Diagram

```mermaid
flowchart LR
    U([User])
    G([Guest User])
    S([Signed-in User])

    UC1((Review Code))
    UC2((Sign In))
    UC3((View History))
    UC4((Clear History))

    U --> UC1
    G --> UC1
    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4
```

## 5. Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Clerk
    participant Backend
    participant AI
    participant DB as MongoDB

    User->>Frontend: Click login
    Frontend->>Clerk: Send login request
    Clerk-->>Frontend: Return session and token

    User->>Frontend: Enter code and click review
    Frontend->>Backend: Send code + optional token
    Backend->>AI: Ask for review
    AI-->>Backend: Return review

    alt User is logged in
        Backend->>DB: Save history
        DB-->>Backend: History saved
    end

    Backend-->>Frontend: Return review
    Frontend-->>User: Show result

    User->>Frontend: Click show history
    Frontend->>Backend: Request history + token
    Backend->>DB: Fetch user history
    DB-->>Backend: Return saved history
    Backend-->>Frontend: Send history list
    Frontend-->>User: Show history
```

## 6. Context Level Diagram

```mermaid
flowchart LR
    U[User]
    S([Code Review System])
    A[Authentication Service<br/>Clerk]
    I[AI Review Service]
    D[(MongoDB)]

    U -->|Login details| S
    S -->|Authentication request| A
    A -->|Authentication result| S

    U -->|Code for review| S
    S -->|Review prompt| I
    I -->|Review result| S

    U -->|Show history request| S
    S -->|Save and fetch history| D
    D -->|History details| S

    S -->|Review result and history| U
```

## 7. Level 1 Diagram

```mermaid
flowchart TD
    U[User]

    P1[1.0 User Login]
    P2[2.0 Submit Code]
    P3[3.0 Generate Review]
    P4[4.0 Save Review History]
    P5[5.0 View History]
    P6[6.0 Clear History]

    E1[Clerk Authentication]
    E2[AI Review Service]
    D1[(MongoDB History)]

    U -->|Login details| P1
    P1 -->|Authentication request| E1
    E1 -->|User session and token| P1
    P1 -->|Login success| U

    U -->|Code input| P2
    P2 -->|Review request| P3
    P3 -->|Prompt for code review| E2
    E2 -->|Generated review| P3
    P3 -->|Review result| U

    P3 -->|If user is logged in| P4
    P4 -->|Save code and review| D1

    U -->|Show history request| P5
    P5 -->|Fetch saved reviews| D1
    D1 -->|Saved history list| P5
    P5 -->|History details| U

    U -->|Clear history request| P6
    P6 -->|Delete saved reviews| D1
    P6 -->|History cleared message| U
```

## Short Notes

- Guest users can review code.
- Signed-in users can review code and save history.
- Clerk handles login.
- MongoDB stores history.
- Backend connects frontend, AI, and database.
