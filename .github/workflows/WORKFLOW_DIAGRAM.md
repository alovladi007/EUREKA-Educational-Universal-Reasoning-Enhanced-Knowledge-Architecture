# Professional Modules Workflow - Visual Diagram

## Workflow Architecture

```mermaid
graph TB
    Start([Workflow Triggered]) --> Trigger{Trigger Type}
    
    Trigger -->|Manual| Manual[Manual Dispatch<br/>via Actions UI]
    Trigger -->|Automatic| Auto[Push to develop]
    
    Manual --> PreFlight[Pre-flight Checks]
    Auto --> PreFlight
    
    PreFlight --> Check1[Validate Structure]
    Check1 --> Check2[Generate Version]
    Check2 --> Check3[Check Conflicts]
    Check3 --> Matrix{Matrix Strategy<br/>4 Parallel Jobs}
    
    Matrix -->|Medical| Med[Medical School Module]
    Matrix -->|Law| Law[Law School Module]
    Matrix -->|MBA| MBA[MBA Program Module]
    Matrix -->|Engineering| Eng[Engineering Module]
    
    Med --> MedBuild[Build Medical]
    Law --> LawBuild[Build Law]
    MBA --> MBABuild[Build MBA]
    Eng --> EngBuild[Build Engineering]
    
    MedBuild --> MedPR[Create PR<br/>tier:medical]
    LawBuild --> LawPR[Create PR<br/>tier:law]
    MBABuild --> MBAPR[Create PR<br/>tier:mba]
    EngBuild --> EngPR[Create PR<br/>tier:engineering]
    
    MedPR --> Summary
    LawPR --> Summary
    MBAPR --> Summary
    EngPR --> Summary
    
    Summary[Build Summary] --> Notify[Notifications]
    Notify --> End([Complete])
    
    style Start fill:#4CAF50
    style End fill:#4CAF50
    style Matrix fill:#2196F3
    style Med fill:#e74c3c,color:#fff
    style Law fill:#3498db,color:#fff
    style MBA fill:#2ecc71,color:#fff
    style Eng fill:#f39c12,color:#fff
```

## Detailed Module Build Flow

```mermaid
graph LR
    subgraph "Module Build Process"
        A[Create Branch] --> B[Setup Environment]
        B --> C[Generate Schema]
        C --> D[Generate API]
        D --> E[Generate Frontend]
        E --> F[Generate Docs]
        F --> G[Generate Tests]
        G --> H{Run Tests?}
        H -->|Yes| I[Execute Tests]
        H -->|No| J[Skip Tests]
        I --> K[Commit Changes]
        J --> K
        K --> L[Push Branch]
        L --> M[Create PR]
        M --> N[Add Labels]
    end
    
    style A fill:#4CAF50
    style M fill:#2196F3
    style N fill:#9C27B0
```

## Parallel Execution Timeline

```mermaid
gantt
    title Professional Modules Build Timeline
    dateFormat mm:ss
    axisFormat %M:%S
    
    section Pre-flight
    Validate Structure    :00:00, 30s
    Generate Version      :00:30, 10s
    Check Conflicts       :00:40, 20s
    
    section Medical School
    Create Branch        :01:00, 10s
    Generate Files       :01:10, 60s
    Run Tests           :02:10, 30s
    Create PR           :02:40, 20s
    
    section Law School
    Create Branch        :01:00, 10s
    Generate Files       :01:10, 60s
    Run Tests           :02:10, 30s
    Create PR           :02:40, 20s
    
    section MBA Program
    Create Branch        :01:00, 10s
    Generate Files       :01:10, 60s
    Run Tests           :02:10, 30s
    Create PR           :02:40, 20s
    
    section Engineering
    Create Branch        :01:00, 10s
    Generate Files       :01:10, 60s
    Run Tests           :02:10, 30s
    Create PR           :02:40, 20s
    
    section Summary
    Generate Report      :03:00, 30s
    Send Notifications   :03:30, 15s
```

## PR Creation Flow

```mermaid
sequenceDiagram
    participant W as Workflow
    participant G as Git
    participant GH as GitHub API
    participant R as Repository
    
    W->>G: Create feature branch
    G-->>W: Branch created
    
    W->>G: Commit changes
    G-->>W: Changes committed
    
    W->>G: Push to remote
    G->>R: Push branch
    R-->>G: Push successful
    
    W->>GH: Create Pull Request
    GH->>R: Create PR
    R-->>GH: PR created
    
    W->>GH: Add labels
    GH->>R: Update PR labels
    R-->>GH: Labels added
    
    GH-->>W: PR URL
    
    Note over W,R: Process repeats for each module
```

## Module Structure Generation

```mermaid
graph TD
    Root[modules/] --> Med[medical-school/]
    Root --> Law[law-school/]
    Root --> MBA[mba/]
    Root --> Eng[engineering/]
    
    Med --> MedDB[database/<br/>schema.sql]
    Med --> MedAPI[api/<br/>endpoints.py]
    Med --> MedFE[frontend/<br/>Dashboard.tsx]
    Med --> MedDocs[docs/<br/>README.md]
    Med --> MedTests[tests/<br/>test_api.py]
    Med --> MedInfo[BUILD_INFO.txt]
    
    Law --> LawDB[database/<br/>schema.sql]
    Law --> LawAPI[api/<br/>endpoints.py]
    Law --> LawFE[frontend/<br/>Dashboard.tsx]
    Law --> LawDocs[docs/<br/>README.md]
    Law --> LawTests[tests/<br/>test_api.py]
    Law --> LawInfo[BUILD_INFO.txt]
    
    MBA --> MBADB[database/<br/>schema.sql]
    MBA --> MBAAPI[api/<br/>endpoints.py]
    MBA --> MBAFE[frontend/<br/>Dashboard.tsx]
    MBA --> MBADocs[docs/<br/>README.md]
    MBA --> MBATests[tests/<br/>test_api.py]
    MBA --> MBAInfo[BUILD_INFO.txt]
    
    Eng --> EngDB[database/<br/>schema.sql]
    Eng --> EngAPI[api/<br/>endpoints.py]
    Eng --> EngFE[frontend/<br/>Dashboard.tsx]
    Eng --> EngDocs[docs/<br/>README.md]
    Eng --> EngTests[tests/<br/>test_api.py]
    Eng --> EngInfo[BUILD_INFO.txt]
    
    style Root fill:#9E9E9E
    style Med fill:#e74c3c,color:#fff
    style Law fill:#3498db,color:#fff
    style MBA fill:#2ecc71,color:#fff
    style Eng fill:#f39c12,color:#fff
```

## Decision Flow

```mermaid
flowchart TD
    Start([User Triggers Workflow]) --> Input{Manual or Auto?}
    
    Input -->|Manual| Config[Configure Options:<br/>- Base Branch<br/>- Run Tests]
    Input -->|Auto| Default[Use Default Config]
    
    Config --> Validate
    Default --> Validate
    
    Validate{Pre-flight Pass?}
    Validate -->|Yes| Build[Build All Modules]
    Validate -->|No| Fail[❌ Fail Workflow]
    
    Build --> TestFlag{Run Tests?}
    TestFlag -->|Yes| RunTests[Execute Tests]
    TestFlag -->|No| SkipTests[Skip Tests]
    
    RunTests --> TestResult{Tests Pass?}
    TestResult -->|Yes| CreatePR
    TestResult -->|No| FixTests[❌ Fix Tests]
    
    SkipTests --> CreatePR[Create Pull Requests]
    
    CreatePR --> AllSuccess{All PRs Created?}
    AllSuccess -->|Yes| Success[✅ Success!]
    AllSuccess -->|No| Partial[⚠️ Partial Success]
    
    Success --> Summary[Generate Summary]
    Partial --> Summary
    
    Summary --> Notify[Send Notifications]
    Notify --> End([Workflow Complete])
    
    style Start fill:#4CAF50
    style Success fill:#4CAF50
    style Fail fill:#f44336
    style FixTests fill:#f44336
    style Partial fill:#ff9800
    style End fill:#2196F3
```

## Label System

```mermaid
mindmap
  root((PR Labels))
    Module Labels
      tier:medical
      tier:law
      tier:mba
      tier:engineering
    Type Labels
      enhancement
      automated
    Priority Labels
      priority:high
    Size Labels
      size:large
    Status Labels
      status:review-needed
      status:approved
      status:changes-requested
```

## Workflow States

```mermaid
stateDiagram-v2
    [*] --> Queued: Workflow Triggered
    Queued --> Running: Job Started
    
    Running --> PreFlight: Pre-flight Checks
    PreFlight --> Building: Matrix Jobs Start
    
    state Building {
        [*] --> Medical
        [*] --> Law
        [*] --> MBA
        [*] --> Engineering
        
        Medical --> MedicalComplete
        Law --> LawComplete
        MBA --> MBAComplete
        Engineering --> EngineeringComplete
        
        MedicalComplete --> [*]
        LawComplete --> [*]
        MBAComplete --> [*]
        EngineeringComplete --> [*]
    }
    
    Building --> Summary: All Builds Complete
    Summary --> Notification: Generate Report
    Notification --> Success: Send Notifications
    
    Success --> [*]: Workflow Complete
    
    Running --> Failed: Error Occurred
    PreFlight --> Failed: Validation Failed
    Building --> Failed: Build Failed
    
    Failed --> [*]: Workflow Failed
    
    note right of Building
        All 4 modules build
        in parallel
    end note
```

## Integration Points

```mermaid
graph TB
    subgraph "External Systems"
        GH[GitHub API]
        Git[Git Repository]
        Actions[GitHub Actions]
    end
    
    subgraph "Workflow"
        W[Orchestration<br/>Workflow]
    end
    
    subgraph "Outputs"
        Branches[Feature Branches]
        PRs[Pull Requests]
        Reports[Build Reports]
    end
    
    Actions --> W
    W --> GH
    W --> Git
    
    GH --> Branches
    GH --> PRs
    W --> Reports
    
    style W fill:#2196F3,color:#fff
    style GH fill:#333,color:#fff
    style Git fill:#f34f29,color:#fff
```

---

## How to View These Diagrams

### In GitHub
These Mermaid diagrams will render automatically when viewing this file on GitHub.

### Locally with VS Code
1. Install the "Markdown Preview Mermaid Support" extension
2. Open this file
3. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac) to preview

### Online
Copy the Mermaid code and paste it into:
- [Mermaid Live Editor](https://mermaid.live/)
- [GitHub Gist](https://gist.github.com/) (will render automatically)

---

**Last Updated**: 2024-10-29  
**Diagram Version**: 1.0.0
