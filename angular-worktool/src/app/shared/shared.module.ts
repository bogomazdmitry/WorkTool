import { NgModule } from "@angular/core";
import { ThemeService } from "./services/theme.service";
import { ThemeChangerComponent } from './layout/theme-changer/theme-changer.component';
import { AppMaterialModule } from "../app-material.module";
import { CommonModule } from "@angular/common";
import { FocusDirective } from "./directives/focus-oninit.directive";

@NgModule({
    declarations: [
        ThemeChangerComponent,
        FocusDirective
    ],
    imports: [
        AppMaterialModule,
        CommonModule
    ],
    exports: [
        CommonModule,
        AppMaterialModule,
        ThemeChangerComponent,
        FocusDirective
    ],
})
export class SharedModule { }