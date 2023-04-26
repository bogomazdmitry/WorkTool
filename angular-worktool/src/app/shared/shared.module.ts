import { NgModule } from "@angular/core";
import { ThemeService } from "./services/theme.service";
import { ThemeChangerComponent } from './layout/theme-changer/theme-changer.component';
import { AppMaterialModule } from "../app-material.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        ThemeChangerComponent
    ],
    imports: [
        AppMaterialModule,
        CommonModule
    ],
    exports: [
        CommonModule,
        AppMaterialModule,
        ThemeChangerComponent
    ],
})
export class SharedModule { }