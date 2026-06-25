public with sharing class UserController {

    @AuraEnabled(cacheable=true)
    public static String getLoggedInUserName(){

        return UserInfo.getName();

    }

}