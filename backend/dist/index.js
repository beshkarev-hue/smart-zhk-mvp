"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsType = exports.RequestType = exports.RequestStatus = exports.PaymentType = exports.PaymentStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["RESIDENT"] = "resident";
    UserRole["MANAGER"] = "manager";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["PAID"] = "paid";
    PaymentStatus["OVERDUE"] = "overdue";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["UTILITIES"] = "utilities";
    PaymentType["MAINTENANCE"] = "maintenance";
    PaymentType["HEATING"] = "heating";
    PaymentType["WATER"] = "water";
    PaymentType["ELECTRICITY"] = "electricity";
    PaymentType["GAS"] = "gas";
    PaymentType["OTHER"] = "other";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["NEW"] = "new";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["REJECTED"] = "rejected";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["REPAIR"] = "repair";
    RequestType["PLUMBING"] = "plumbing";
    RequestType["ELECTRICITY"] = "electricity";
    RequestType["HEATING"] = "heating";
    RequestType["CLEANING"] = "cleaning";
    RequestType["GARBAGE"] = "garbage";
    RequestType["ELEVATOR"] = "elevator";
    RequestType["INTERCOM"] = "intercom";
    RequestType["OTHER"] = "other";
})(RequestType || (exports.RequestType = RequestType = {}));
var NewsType;
(function (NewsType) {
    NewsType["ANNOUNCEMENT"] = "announcement";
    NewsType["NEWS"] = "news";
    NewsType["EVENT"] = "event";
    NewsType["MAINTENANCE"] = "maintenance";
    NewsType["EMERGENCY"] = "emergency";
})(NewsType || (exports.NewsType = NewsType = {}));
//# sourceMappingURL=index.js.map