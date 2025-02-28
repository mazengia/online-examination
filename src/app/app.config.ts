import {ApplicationConfig, provideZoneChangeDetection, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck} from '@angular/fire/app-check';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getDatabase, provideDatabase} from '@angular/fire/database';
import {getFunctions, provideFunctions} from '@angular/fire/functions';
import {getMessaging, provideMessaging} from '@angular/fire/messaging';
import {getPerformance, providePerformance} from '@angular/fire/performance';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {getRemoteConfig, provideRemoteConfig} from '@angular/fire/remote-config';
import {getVertexAI, provideVertexAI} from '@angular/fire/vertexai';
import {icons} from './icons-provider';
import {provideNzIcons} from 'ng-zorro-antd/icon';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient} from '@angular/common/http';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "online-examination-9f654",
      appId: "1:798155898612:web:d6c4e1e8d72148a335e8a1",
      storageBucket: "online-examination-9f654.firebasestorage.app",
      apiKey: "AIzaSyBDUZ2t6CapfPozY0frEDaynJZtQ2UR6Ow",
      authDomain: "online-examination-9f654.firebaseapp.com",
      messagingSenderId: "798155898612",
      measurementId: "G-4MGXCW7YMV"
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
    // provideAppCheck(() => {
    //   const provider = new ReCaptchaEnterpriseProvider('');
    //   return initializeAppCheck(
    //     undefined,
    //     {
    //       provider,
    //       isTokenAutoRefreshEnabled: true
    //     }
    //   );
    // }),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideVertexAI(() => getVertexAI()),
    provideNzIcons(icons), provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient()]
};
