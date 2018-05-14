import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './general/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path : 'login',
        component : LoginComponent
    },
    
    {
        path: 'dashboard',
        loadChildren: 'app/general/general.module#GeneralModule',
        component : DashboardComponent,
        canActivate : [AuthGuard]
    }
    
];

@NgModule({
    imports: [
        
        RouterModule.forRoot(routes),
    ],
    
    exports: [RouterModule],
    providers : [AuthGuard]
})
export class AppRoutingModule { }