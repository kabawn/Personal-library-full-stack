import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { PersonalLibraryComponent } from './personal-library/personal-library.component';
import { UniqueIdGuard } from './unique-id.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'personal-library', component: PersonalLibraryComponent, canActivate: [UniqueIdGuard] },
  

  // ... other routes
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
