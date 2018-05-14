import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const deliveryRoutes = [
];
@NgModule({
    imports: [
        RouterModule.forChild(deliveryRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DeliveryRoutingModule { }