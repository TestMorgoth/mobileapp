import { Navigate, Route, Routes } from 'react-router-dom';
import { MobileLayout } from '../components/layout/mobile-layout.js';
import { HomePage } from '../modules/home/home-page.js';
import { ExplorePage } from '../modules/explore/explore-page.js';
import { PoiListPage } from '../modules/poi/poi-list-page.js';
import { PoiDetailPage } from '../modules/poi/poi-detail-page.js';
import { EventsPage } from '../modules/events/events-page.js';
import { EventDetailPage } from '../modules/events/event-detail-page.js';
import { ItinerariesPage } from '../modules/itineraries/itineraries-page.js';
import { ItineraryDetailPage } from '../modules/itineraries/itinerary-detail-page.js';
import { AssistantPage } from '../modules/assistant/assistant-page.js';
import { FavoritesPage } from '../modules/favorites/favorites-page.js';
import { ProfilePage } from '../modules/profile/profile-page.js';
import { AccessibilityPage } from '../modules/accessibility/accessibility-page.js';
import { SettingsPage } from '../modules/settings/settings-page.js';
import { LegalPage } from '../modules/legal/legal-page.js';
import { MapPage } from '../modules/map/map-page.js';
import { PlannerPage } from '../modules/planner/planner-page.js';
import { SearchPage } from '../modules/search/search-page.js';

export function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route element={<MobileLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/poi" element={<PoiListPage />} />
        <Route path="/poi/:id" element={<PoiDetailPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/itineraries" element={<ItinerariesPage />} />
        <Route path="/itineraries/:id" element={<ItineraryDetailPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/accessibility" element={<AccessibilityPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
