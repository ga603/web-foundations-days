# SnapShare Scaling Plan

## 1. Assumptions and Daily Active Users
* **Total Registered Users:** 10,000,000
* **Daily Active Users (DAU) percentage:** 10%
* **Daily Active Users (DAU):** 1,000,000 users active per day
* **Uploads:** 1 photo per active user per day
* **Feed Views:** 50 feed pages per active user per day
* **Photo Size:** 2 MB per photo
* **Thumbnail Size:** 50 KB per thumbnail
* **Total Size per Upload:** 2.05 MB (Photo + Thumbnail)

## 2. Estimates and Calculations
* **Daily Uploads:** 1,000,000 DAU × 1 = 1,000,000 uploads/day
* **Uploads per Second:** 1,000,000 / 86,400 seconds = **~12 uploads/second**
* **Daily Feed Views:** 1,000,000 DAU × 50 = 50,000,000 views/day
* **Average Feed Views per Second:** 50,000,000 / 86,400 seconds = **~579 views/second**
* **Peak Feed Views per Second:** 579 × 5 = **~2,895 views/second**
* **Daily Storage:** 1,000,000 uploads × 2.05 MB = 2,050,000 MB (2.05 TB/day)
* **Storage per Year:** 2.05 TB × 365 days = **~748.25 TB/year**

## 3. System Load Analysis
The system is heavily **read-heavy**. There are 50 million feed views per day compared to only 1 million uploads (a 50:1 read-to-write ratio). For the design, this means we must optimize for read speeds by implementing aggressive caching (like Redis/Memcached), using Content Delivery Networks (CDNs) for static media, and utilizing read replicas for the database so that heavy query loads do not slow down photo uploads.

## 4. Photo Storage Strategy
Photos should not be stored directly inside a relational database because large binary files (BLOBs) cause databases to bloat, making backups, scaling, and querying extremely slow and expensive. Instead, the actual image files should be stored in an **Object Storage** service (like Amazon S3), while the database should only store the metadata (e.g., the URL to the image, the user ID, timestamp, and captions).

## 5. Architecture Diagram

```text
       [ Users / Clients ]
               |
               v
       [ Content Delivery Network (CDN) ] 
               |
               v
       [ Load Balancer ]
               |
      +--------+--------+
      |                 |
      v                 v
[ App Server 1 ]  [ App Server 2 ]  <---> [ Cache (Redis/Memcached) ]
      |                 |
      +--------+--------+
               |
     +---------+---------+-------------------+
     |                   |                   |
     v                   v                   v
[ Object Storage ]   [ Message Queue ]   [ Primary DB (Writes) ]
 (S3 for files)          |                   |
                         v                   v
                     [ Worker ]          [ Read Replica DB (Reads) ]