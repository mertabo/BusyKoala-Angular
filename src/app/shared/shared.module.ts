import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, PageNotFoundComponent],
  imports: [CommonModule, RouterModule, NzResultModule],
  exports: [NavbarComponent, FooterComponent],
})
export class SharedModule {}
