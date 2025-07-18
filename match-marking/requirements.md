# Requirements Document

## Introduction

The Badminton Match Marking System is a real-time web application designed to streamline badminton match organization and tracking. The system enables players to indicate readiness, automatically creates balanced doubles matches, assigns courts, tracks scores in real-time, and maintains comprehensive player statistics. The application serves players, administrators, and spectators with different levels of access and functionality.

## Requirements

### Requirement 1

**User Story:** As a player, I want to authenticate using OAuth (Google/Facebook), so that I can securely access the system and maintain my profile.

#### Acceptance Criteria

1. WHEN a player visits the application THEN the system SHALL present OAuth login options for Google and Facebook
2. WHEN a player successfully authenticates THEN the system SHALL create or update their profile with name, avatar, and email
3. WHEN a player logs in THEN the system SHALL store their authentication state for the session
4. IF a player's OAuth token expires THEN the system SHALL prompt for re-authentication

### Requirement 2

**User Story:** As a player, I want to set and update my skill level, so that I can be matched with players of appropriate skill.

#### Acceptance Criteria

1. WHEN a new player completes registration THEN the system SHALL prompt them to select their registered skill level from 6 tiers (Beginner to P)
2. WHEN a player updates their skill level THEN the system SHALL save the change and use it for future matchmaking
3. WHEN displaying player profiles THEN the system SHALL show both registered and played skill levels

### Requirement 3

**User Story:** As a player, I want to mark myself as ready to play, so that I can be included in the next available match.

#### Acceptance Criteria

1. WHEN a player marks themselves as ready THEN the system SHALL add them to the readiness queue
2. WHEN a player is already in queue THEN the system SHALL allow them to remove themselves from ready status
3. WHEN 4 players are ready THEN the system SHALL automatically create a match within 30 seconds
4. IF a player doesn't respond to match creation within 2 minutes THEN the system SHALL remove them from the queue

### Requirement 4

**User Story:** As the system, I want to automatically create balanced doubles matches, so that games are competitive and fair.

#### Acceptance Criteria

1. WHEN 4 players are in the ready queue THEN the system SHALL create teams using balanced or random assignment
2. WHEN creating teams THEN the system SHALL consider player skill levels for balanced matches
3. WHEN a match is created THEN the system SHALL assign a played skill level that may differ from registered level
4. WHEN teams are formed THEN the system SHALL notify all 4 players of their team assignments

### Requirement 5

**User Story:** As an administrator, I want to manage courts and override matches, so that I can handle exceptional situations and court management.

#### Acceptance Criteria

1. WHEN an admin logs in THEN the system SHALL provide additional administrative controls
2. WHEN an admin creates or modifies court information THEN the system SHALL update court availability in real-time
3. WHEN an admin overrides a match THEN the system SHALL allow manual team reassignment or match cancellation
4. WHEN courts are managed THEN the system SHALL track court status (available, occupied)

### Requirement 6

**User Story:** As a player or admin, I want to input match scores, so that the system can track game progress and determine winners.

#### Acceptance Criteria

1. WHEN a match is ongoing THEN any participating player or admin SHALL be able to input scores
2. WHEN scores are entered THEN the system SHALL validate doubles format rules (best of 3, 21 points, 2-point margin)
3. WHEN scores are updated THEN the system SHALL broadcast changes to all connected users in real-time
4. WHEN a game reaches winning conditions THEN the system SHALL automatically advance to the next game or end the match

### Requirement 7

**User Story:** As a spectator, I want to view live match scores without logging in, so that I can follow ongoing games.

#### Acceptance Criteria

1. WHEN a spectator visits the public dashboard THEN the system SHALL display all ongoing matches and current scores
2. WHEN match scores are updated THEN the spectator view SHALL refresh automatically within 5 seconds
3. WHEN no matches are ongoing THEN the system SHALL display a message indicating no active games
4. WHEN accessing the spectator view THEN the system SHALL NOT require authentication

### Requirement 8

**User Story:** As a player, I want to view my match history and statistics, so that I can track my progress and performance.

#### Acceptance Criteria

1. WHEN a player accesses their profile THEN the system SHALL display total matches played and won/lost record
2. WHEN viewing statistics THEN the system SHALL show win rate broken down by skill level
3. WHEN displaying match history THEN the system SHALL include frequent teammates and opponents
4. WHEN a match ends THEN the system SHALL automatically update all participants' statistics

### Requirement 9

**User Story:** As the system, I want to manage match lifecycle states, so that matches progress through defined stages.

#### Acceptance Criteria

1. WHEN a match is created THEN the system SHALL set status to "Pending"
2. WHEN players confirm participation THEN the system SHALL change status to "Ongoing"
3. WHEN a match concludes THEN the system SHALL set status to "Finished" and free the assigned court
4. WHEN a match has no score input for 30 minutes THEN the system SHALL allow manual match ending

### Requirement 10

**User Story:** As a player, I want real-time updates during matches, so that I stay informed of score changes and match progress.

#### Acceptance Criteria

1. WHEN connected to a match THEN the system SHALL provide real-time score updates via WebSocket connection
2. WHEN a player joins or leaves a match THEN the system SHALL broadcast the change to all participants
3. WHEN network connectivity is lost THEN the system SHALL attempt to reconnect and sync the latest match state
4. WHEN match status changes THEN the system SHALL notify all relevant users immediately
