---
term: "Zero-Wipe MDM Migration"
category: ["MDM"]
tags: ["Migration", "Zero-Wipe", "ABM", "ASM", "Transfer"]
---

## Definition

Introduced in iOS 26 and macOS Tahoe, Zero-Wipe MDM Migration is a feature that allows a device to be moved from one MDM server to another without erasing the user's data. This process synchronizes through Apple School Manager (ASM) and allows the device to keep its existing applications and files while simply switching its "Manager." This eliminates the need for time-consuming backups and restores during a system upgrade or vendor switch.

## Plain English

In the past, switching to a new management system was like "tearing down a house and rebuilding it" just to change who was the landlord. Now, Zero-Wipe Migration is like "Keeping your house and all your furniture exactly as it is, but just hiring a new security company." All your photos, apps, and homework stay on the iPad, but the school gets to manage it using a newer, better system.

## MDM Related

Administrators can set an "Enforcement Deadline" to ensure all devices complete the migration by a specific date. Devices that have not migrated will receive escalating notifications as the deadline approaches.

## Risk Advisory (Education)

**Zero-Wipe Migration is NOT recommended for educational environments.** While the feature works well in enterprise settings, schools should be aware of the following risks:

* **Legacy Profile Conflicts**: Old configuration profiles may remain cached on the device, causing Apple Classroom to malfunction or fail to connect.
* **VPP License Conflicts**: App licenses from the old MDM may not transfer cleanly, resulting in students losing access to critical learning apps.
* **Shared iPad Complications**: On Shared iPads, user data from multiple students can become mixed or corrupted during migration.

**Recommendation**: For school-owned devices, continue using **Return to Service** (a full wipe with automatic re-enrollment) to ensure a clean and stable management state.
