# TicketHub System Design

## 1. Requirements
*   **Functional:**
    *   Users can browse upcoming events and view seat availability.
    *   Users can temporarily hold a seat while checking out.
    *   Users can pay for held seats to confirm an order.
    *   Users can view their purchased tickets.
*   **Non-Functional:**
    *   **Speed (Low Latency):** Seat availability must reflect in near real-time so users do not try to book already-taken seats.
    *   **Correctness (Strong Consistency):** The system must strictly guarantee no double-booking of the same seat under any circumstances.
    *   **Fairness:** During high-demand sales, users should be placed in a first-come, first-served queue rather than crashing the site.

## 2. Estimates and Traffic Comparison
*   **Normal Traffic:**
    *   *Views:* 50,000 visitors × 10 pages = 500,000 views/day (Average: ~5.8 views/second).
    *   *Purchases:* 5,000 tickets sold/day (Average: ~0.05 purchases/second).
*   **"Big Sale" Peak Traffic (10 minutes):**
    *   *Views/Traffic:* 200,000 people rushing the site in 10 minutes (600 seconds) = ~333 requests/second minimum, but likely peaking much higher due to aggressive page refreshing.
    *   *Purchases:* 20,000 seats sold in 600 seconds = ~33 purchases/second.
*   **Comparison:** Peak traffic read volume is at least 50 to 60 times higher than normal traffic. Write/purchase volume spikes drastically, jumping from 0.05 per second to 33 per second (a 660x increase).

## 3. API Endpoints
1.  **`GET /events`**: Returns a list of upcoming concerts and events.
2.  **`GET /events/:id/seats`**: Returns a layout of seats for a specific event and their current status (available, held, booked).
3.  **`POST /seats/:id/hold`**: Temporarily reserves a seat for a specific user for a set time (e.g., 5 minutes) to complete payment.
4.  **`POST /orders`**: Processes payment for the held seats and permanently changes the seat status to booked.
5.  **`GET /users/:id/tickets`**: Retrieves a list of all successful tickets purchased by a specific user.

## 4. Data Model
*   **`users`**: `id` (PK), `name`, `email`, `created_at`
*   **`events`**: `id` (PK), `name`, `date`, `venue_name`
*   **`seats`**: `id` (PK), `event_id` (FK), `seat_number`, `status` (ENUM: available, held, booked), `held_by` (FK -> users.id), `hold_expires_at`
*   **`orders`**: `id` (PK), `user_id` (FK), `event_id` (FK), `total_amount`, `status` (ENUM: pending, paid, failed)

**Relationships:**
*   One *Event* has Many *Seats*.
*   One *User* has Many *Orders*.
*   One *Order* has Many *Seats* (A user can buy multiple tickets in one order).

## 5. Preventing Double-Booking
To prevent two people from buying the same seat during a massive traffic spike, the system must use **ACID Transactions** and database **Row-Level Locking**. 
When a user clicks "hold", the database runs a query like: 
`UPDATE seats SET status = 'held', held_by = 123 WHERE id = 99 AND status = 'available';`
Because of the `AND status = 'available'` constraint, if a second user attempts to buy the seat a millisecond later, the database rejects it because the status has already changed. Using `SELECT ... FOR UPDATE` locks the specific seat row during the transaction, guaranteeing only one user can claim it.

## 6. Architecture Diagram

```text
       [ Users (200,000 peak) ]
               |
               v
       [ Content Delivery Network (CDN) ] 
               |
               v
       [ Load Balancer ]
               |
       [ Virtual Waiting Room (Queue) ]
               |
      +--------+--------+
      |                 |
[ App Server 1 ]  [ App Server 2 ] ---> [ Distributed Cache (Redis) ]
      |                 |
      +--------+--------+
               |
     +---------+---------+
     |                   |
[ Primary DB ] ---> [ Read Replica DB ]
  (Writes)            (Reads)