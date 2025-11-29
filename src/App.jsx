<script type="text/babel">
    import { useState, useEffect, useRef } from 'react';

    // Persistent Database using window.storage
    const DB = {
      async addCheckIn(data) {
        try {
          const checkIn = {
            id: Date.now(),
            ...data,
            createdAt: new Date().toISOString()
          };
          
          await window.storage.set(`checkin:${checkIn.id}`, JSON.stringify(checkIn));
          return checkIn;
        } catch (error) {
          console.error('Error saving check-in:', error);
          return null;
        }
      },
      
      async getCheckIns() {
        try {
          const result = await window.storage.list('checkin:');
          if (!result || !result.keys) return [];
          
          const checkIns = [];
          for (const key of result.keys) {
            try {
              const data = await window.storage.get(key);
              if (data && data.value) {
                checkIns.push(JSON.parse(data.value));
              }
            } catch (e) {
              console.error('Error reading check-in:', e);
            }
          }
          return checkIns;
        } catch (error) {
          console.error('Error getting check-ins:', error);
          return [];
        }
      },
      
      async getCheckInsByDate(date) {
        const allCheckIns = await this.getCheckIns();
        return allCheckIns.filter(c => {
          const checkInDate = new Date(c.checkInDate).toDateString();
          const targetDate = new Date(date).toDateString();
          return checkInDate === targetDate;
        });
      }
    };
  export default App;
