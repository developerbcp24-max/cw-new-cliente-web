import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterLoginComponent } from './master-login/master-login.component';
import { LoginComponent } from './login/login.component';
import { BreakingNewsComponent } from './breaking-news/breaking-news.component';
import { ManualsComponent } from './manuals/manuals.component';
import { QuestionsComponent } from './questions/questions.component';
import { GenerateKeyComponent } from './generate-key/generate-key.component';
import { GenerateAliasComponent } from './generate-alias/generate-alias.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';
import { RegisterMobileComponent } from './register-mobile/register-mobile.component';
import { FunctionsFeaturesComponent } from './components/pages-default/functions-features/functions-features.component';

const routes: Routes = [
  {
    path: '',
    component: MasterLoginComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'generateKey', component: GenerateKeyComponent },
      { path: 'generateAlias', component: GenerateAliasComponent },
      { path: 'manuals', component: ManualsComponent },
      { path: 'new-news', component: BreakingNewsComponent },
      { path: 'questions', component: QuestionsComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'register-mobile', component: RegisterMobileComponent },
      { path: 'functions-features', component: FunctionsFeaturesComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
