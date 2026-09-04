<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



#  🎯


## Basic Details
### Team Name: VIBEലേഷ്


### Team Members
- THANIYA H- MODEL ENGINEERING COLLEGE, THRIKKAKARA

### Project Description
A playful mood-based music website that asks how you’re feeling—then flips the script. Instead of matching your mood, it plays a song with a completely opposite vibe to surprise, energize, or cheer you up.

### The Problem (that doesn't exist)
People’s playlists are way too emotionally supportive. When you’re sad, they play sad songs; when you’re happy, they play happy songs—where’s the chaos in that?

### The Solution (that nobody asked for)
Our website asks how you feel, then ignores your answer just enough to play a song with the complete opposite energy. Sad? Here’s a party anthem. Feeling unstoppable? Time for a heartbreak ballad.

## Technical Details
### Technologies/Components Used
For Software:
For Software:

- Languages used: HTML, CSS, JavaScript  
- Frameworks used: None / Vanilla JavaScript  
- Libraries used: Spotify Web API or YouTube IFrame Player API  
- Tools used: VS Code, GitHub, and a web browser for testing  

###For Software:

# Installation

```bash
git clone <https://github.com/thaniyaharis6-web/useless_project_temp.git>
cd mood-opposite-music
```

# Run

```bash
python app.py
```


### Project Documentation
For Software:

# Screenshots 
<img width="1185" height="811" alt="Screenshot 2026-09-04 053753" src="https://github.com/user-attachments/assets/592ae964-64d2-400b-ac4b-5dcaa7dba024" />
A bold, dark-themed mood-selection page for a Malayalam audio experience. Users choose a vibe—Angry, Hyper, Romantic, Sad, or Happy—or type a custom feeling, then click “Diagnose Me” to receive an opposite-vibe song and a playful roast.

<img width="1066" height="850" alt="Screenshot 2026-09-04 053845" src="https://github.com/user-attachments/assets/6342575e-c796-426b-98aa-8baa583c9752" />
The results screen presents the selected opposite-vibe audio track with a visual waveform, playback controls, and a themed “Sad Tape” label. Below it, humorous prescription notes deliver sarcastic commentary and let users cycle through multiple diagnoses or change their emotion.

<img width="1075" height="857" alt="Screenshot 2026-09-04 053946" src="https://github.com/user-attachments/assets/4d744b22-28ab-4ec3-841c-f964e0398908" />
This result screen turns a romantic mood into a contrasting “Pranaya Kaalam Acoustic” audio experience, complete with animated waveform-style playback controls. It also adds a playful roast about overthinking romance, with options to view more diagnoses or choose a different emotion.

# Diagrams
## 🔄 System Architecture & Data Flow

```mermaid
graph TD
    A[<b>User Interface</b><br>Input mood string] -->|1. Submits current mood| B[<b>Client-Side Logic</b><br>app.js]
    
    subgraph Client App
        B -->|Displays loading state & animations| B
        B -->|Formats prompt with system instructions| C[<b>API Request Handler</b>]
    end

    C -->|2. POST Request JSON payload| D[<b>OpenAI API</b><br>gpt-4o-mini]

    subgraph AI Engine
        D -->|Analyzes user sentiment| D1[Reverse Mood Selection]
        D1 -->|Generates sarcastic roast| D2[Format Response as JSON]
    end

    D2 -->|3. Returns JSON: {roast, youtubeSearch}| E[<b>Client-Side Renderer</b>]

    subgraph DOM Updates
        E -->|Extracts roast| F[Update #roastText]
        E -->|Encodes query| G[Generate YouTube Embed URL]
        G -->|Injects iframe| H[Render #playerContainer]
    end

    H -->|4. Streams audio/video embed| I[<b>End User Experience</b>]
```

### Project Demo
# Video
(https://drive.google.com/file/d/1lOtpdbxE3WmsW00BlKY05ZUfBcMjxbZb/view?usp=sharing)
This video demonstrates the interface and workflow of The Anti-Vibe Jukebox (or mood-roasting web app):

1.Analysis Screen: The app starts by displaying an animated loading state with sarcastic status checks ("Measuring toxicity levels in blood...", "Extracting optimal audio frequencies from Malayalam archives...", "Synthesizing personalized sarcastic diagnosis...").

2.Audio Streaming & Roast Interface: Once processing completes, the dashboard displays:

Now Streaming Audio: Plays a song specifically chosen to clash with the mood—in this case, "Vibrant Celebration Anthem" (Joyful Malayalam Audio) paired with a live audio visualizer effect and playback controls.

Prescription Notes & Observations: Displays a sarcastic AI-generated quote ("Who gave you permission to be this cheerful? It makes the rest of us deeply uncomfortable.") along with options to cycle through additional diagnoses or change the emotion entirely.



## Team Contributions
- DEVIKA G NAIR- partner in crime!

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
