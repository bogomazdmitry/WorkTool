import { NgModule } from "@angular/core";
import { ThemeService } from "./services/theme.service";
import { ThemeChangerComponent } from './layout/theme-changer/theme-changer.component';
import { AppMaterialModule } from "../app-material.module";
import { CommonModule } from "@angular/common";
import { FocusDirective } from "./directives/focus-oninit.directive";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations: [
        ThemeChangerComponent,
        FocusDirective
    ],
    imports: [
        AppMaterialModule,
        CommonModule,
        HttpClientModule 
    ],
    exports: [
        CommonModule,
        AppMaterialModule,
        ThemeChangerComponent,
        FocusDirective
    ],
})
export class SharedModule { }