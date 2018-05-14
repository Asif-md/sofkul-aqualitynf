import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const quotationRoutes = [
];
@NgModule({
    imports: [
        RouterModule.forChild(quotationRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class QuotationRoutingModule { }