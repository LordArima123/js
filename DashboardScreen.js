import React, { useEffect, useState, useContext } from "react";
import { Image, ScrollView, StyleSheet, View, Alert, Text } from "react-native";
import axios from "axios";
import { Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import {
  getDatePrefix,
  fetchDailyAggregates,
  sumObjectValues,
  isAndroid,
  convertCsvCatalogToJSON,
} from "../Util";
import DashboardCard from "../components/DashboardCard";
import MultiPicker from "../components/MultiPicker";
import DashboardDateRangePicker from "../components/DashboardDateRangePicker";
import { getTheme } from "../constants/Colors";
import { MainContext } from "../context/MainContext";
import { date } from "yup";

const datePickerButtonIcon = (
  <Ionicons name="calendar" size={20} color="white" />
);
const soldProductListTypes = {
  sold_count: { dataKey: "topProductsSold", labelKey: "dashboard_sold_count" },
  profit: { dataKey: "topProductProfit", labelKey: "dashboard_profit" },
};

const otherPosCatalogs = {};

const DashboardScreen = () => {
  const context = useContext(MainContext);
  const styles = getStyles();
  const getInitialData = () => {
    return {
      totalRevenue: 0,
      totalRounding: 0,
      nTransactions: 0,
      nTransactionsByPaymentMethod: [],
      nProductsSold: 0,
      revenueByEmployee: [],
      revenueByEmployeePaymentMethod: [],
      revenueByGroup: [],
      revenueByPaymentMethod: [],
      revenueByTax: [],
      revenueByOrs: [],
      topProductsSold: [],
      topProductProfit: [],
      totalProductProfit: 0,
      canceledRevenues: [],
      totalCanceled: 0,
      canceledRevenuesByEmloyee: [],
      nOrders: 0,
      orderTotal: 0,
    };
  };
  const [data, setData] = useState(getInitialData());
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const [dateCompare, setDateCompare] = useState({
    start: new Date(),
    end: new Date(),
  });

  const [selectedPosIds, setSelectedPosIds] = useState({
    [global.App.auth.registerId]: true,
  });
  const [selectedSoldProductListType, setSelectedSoldProductListType] =
    useState("sold_count");
  const [loading, setLoading] = useState(false);

  const [activeDatePicker, setActiveDatePicker] = useState("");

  const [showCompare, setShowCompare] = useState(false);

  const handleRefresh = () => {
    (async () => {
      setLoading(true);
      setData(getInitialData());
      try {
        const resp = await fetchDailyAggregates(
          dateRange.start,
          dateRange.end,
          Object.keys(selectedPosIds),
          context.posList
        );
        setLoading(false);
        if (!resp.data.success) {
          return Alert.alert(
            global.App.lang.misc_info,
            global.App.lang[resp.data.msg] || resp.data.msg
          );
        }
        // console.log(resp.data.msg.revenueByTax);
        // console.log(resp.data.msg.canceledRevenues);
        // console.log(resp.data.msg.canceledRevenuesByEmployee);
        const totalRevenue = sumObjectValues(resp.data.msg.revenueByTax);
        const isMultiplePosSelected = Object.keys(selectedPosIds).length > 1;
        const isUserAssignedPos = selectedPosIds[global.App.auth.registerId];
        if (!isMultiplePosSelected && !isUserAssignedPos) {
          const selectedPosId = Object.keys(selectedPosIds).join("");
          if (!otherPosCatalogs[selectedPosId]) {
            const catalogResp = await axios.get(
              `/api/catalog?registerId=${selectedPosId}`
            );
            if (catalogResp.data.groups) {
              otherPosCatalogs[selectedPosId] = catalogResp.data;
              otherPosCatalogs[selectedPosId].articles =
                convertCsvCatalogToJSON(otherPosCatalogs[selectedPosId].csv);
              delete otherPosCatalogs[selectedPosId].csv;
              const groups = otherPosCatalogs[selectedPosId].groups;
              otherPosCatalogs[selectedPosId].groups = {};
              groups.forEach((group) => {
                otherPosCatalogs[selectedPosId].groups[group.number] = group;
              });
            }
          }
        }
        const d = {
          totalRevenue,
          totalRounding: resp.data.msg.round || 0,
          nTransactions: resp.data.msg.nTransactions,
          nTransactionsByPaymentMethod: parseNTransactionsByPaymentMethod(
            resp.data.msg.nTransactionsByPaymentMethod || {}
          ),
          nProductsSold: resp.data.msg.nProductsSold,
          revenueByEmployee: parseRevenueByEmployee(
            resp.data.msg.revenueByEmployee
          ),
          revenueByEmployeePaymentMethod: parseRevenueByEmployeePaymentMethod(
            resp.data.msg.revenueByEmployeePaymentMethod || {}
          ),
          revenueByGroup: parseRevenueByGroup(
            resp.data.msg.revenueByGroup,
            isMultiplePosSelected || isUserAssignedPos
              ? global.App.groups
              : (
                  otherPosCatalogs[Object.keys(selectedPosIds).join("")] ||
                  global.App
                ).groups
          ),
          revenueByPaymentMethod: parseRevenueByPaymentMethod(
            resp.data.msg.revenueByPaymentMethod
          ),
          revenueByTax: parseRevenueByTax(resp.data.msg.revenueByTax),
          revenueByOrs: parseRevenueByOrs(
            resp.data.msg.revenueSentToORS,
            totalRevenue
          ),
          topProductsSold: parseTopProductsSold(
            resp.data.msg.soldCntByEan || {},
            isMultiplePosSelected || isUserAssignedPos
              ? global.App.catalog.articles
              : (
                  otherPosCatalogs[Object.keys(selectedPosIds).join("")] ||
                  global.App.catalog
                ).articles
          ),
          topProductProfit: parseTopProductsSold(
            resp.data.msg.profitByEan || {},
            isMultiplePosSelected || isUserAssignedPos
              ? global.App.catalog.articles
              : (
                  otherPosCatalogs[Object.keys(selectedPosIds).join("")] ||
                  global.App.catalog
                ).articles
          ),
          totalProductProfit: sumObjectValues(resp.data.msg.profitByEan || {}),
          canceledRevenues: parseCanceledRevenues(
            resp.data.msg.canceledRevenues || {},
            isMultiplePosSelected || isUserAssignedPos
              ? global.App.catalog.articles
              : (
                  otherPosCatalogs[Object.keys(selectedPosIds).join("")] ||
                  global.App.catalog
                ).articles
          ),
          totalCanceled: sumObjectValues(resp.data.msg.canceledRevenues || {}),
          canceledRevenuesByEmloyee: parseCanceledRevenuesByEmployee(
            resp.data.msg.canceledRevenuesByEmployee || {}
          ),
          nOrders: resp.data.msg.nOrders,
          orderTotal: resp.data.msg.orderTotal,
        };
        if (
          global.App.auth.role === "Seller" &&
          !global.App.auth.privileges.includes("dashboard")
        ) {
          Object.keys(d).forEach((key) => {
            d[key] =
              typeof d[key] === "number" ? 0 : d[key].length >= 0 ? [] : {};
          });
        }
        setData(d);
      } catch (err) {
        console.log(err);
        setLoading(false);
        // console.log(typeof err.response.status);
        Alert.alert(
          global.App.lang.misc_info,
          err && err.response && err.response.status === 404
            ? global.App.lang.srv_no_data_available
            : global.App.lang.misc_error
        );
      }
    })();
  };

  useEffect(handleRefresh, [dateRange, selectedPosIds]);

  const parseCanceledRevenues = (canceledRevenues, articles) => {
    return Object.keys(canceledRevenues).map((key) => {
      const article = articles[key];
      return {
        key: article ? article.name : `N/A [${key}]`,
        value: `${canceledRevenues[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseCanceledRevenuesByEmployee = (canceledRevenuesByEmloyee) => {
    return Object.keys(canceledRevenuesByEmloyee).map((key) => {
      return {
        key:
          global.App.employees[key.replace(/;/g, ".")] ||
          key.replace(/;/g, "."),
        value: `${canceledRevenuesByEmloyee[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseRevenueByEmployee = (revenueByEmployee) => {
    return Object.keys(revenueByEmployee).map((key) => {
      return {
        key:
          global.App.employees[key.replace(/;/g, ".")] ||
          key.replace(/;/g, "."),
        value: `${revenueByEmployee[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseNTransactionsByPaymentMethod = (nTransactionsByPaymentMethod) => {
    return Object.keys(nTransactionsByPaymentMethod).map((method) => {
      const value = nTransactionsByPaymentMethod[method];
      return {
        key: `${global.App.lang[`payment_method_${method}`] || method}`,
        value,
      };
    });
  };

  const parseRevenueByEmployeePaymentMethod = (
    revenueByEmployeePaymentMethod
  ) => {
    return Object.keys(revenueByEmployeePaymentMethod).map((key) => {
      const [employee, paymentMethod] = key.split("#");
      return {
        key: `${
          global.App.employees[employee.replace(/;/g, ".")] ||
          employee.replace(/;/g, ".")
        } (${
          global.App.lang[`payment_method_${paymentMethod}`] || paymentMethod
        })`,
        value: `${revenueByEmployeePaymentMethod[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseRevenueByGroup = (revenueByGroup, groups) => {
    return Object.keys(revenueByGroup).map((key) => {
      const group = groups[key];
      return {
        key: group ? `${group.number} - ${group.name}` : "N/A",
        value: `${revenueByGroup[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseRevenueByPaymentMethod = (revenueByPaymentMethod) => {
    return Object.keys(revenueByPaymentMethod).map((key) => {
      return {
        key: global.App.lang[`payment_method_${key}`],
        value: `${revenueByPaymentMethod[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseRevenueByTax = (revenueByTax) => {
    return Object.keys(revenueByTax).map((key) => {
      return {
        key: `${key}%`,
        value: `${revenueByTax[key].formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      };
    });
  };

  const parseRevenueByOrs = (revenueByOrs, totalRevenue) => {
    const sent = sumObjectValues(revenueByOrs);
    const notSent = totalRevenue ? totalRevenue - sent : 0;
    return [
      {
        key: global.App.lang.ors_sent,
        value: `${sent.formatMoney()} ${global.App.settings.currency.symbol}`,
      },
      {
        key: global.App.lang.ors_not_sent,
        value: `${notSent.formatMoney()} ${
          global.App.settings.currency.symbol
        }`,
      },
    ];
  };

  const parseTopProductsSold = (topProductsSold, articles) => {
    return Object.keys(topProductsSold)
      .filter((key) => {
        return !!articles[key];
      })
      .map((key) => {
        const product = articles[key];
        const value = parseFloat(topProductsSold[key].toFixed(3));
        return { key: product ? `${product.name}` : `N/A [${key}]`, value };
      })
      .sort((a, b) => b.value - a.value);
  };

  const handleDatePickerChange = (type) => (event, date) => {
    if (!date) {
      return;
    }
    const dr = {};
    if (type === "end") {
      dr.end = date;
      if (date < dateRange.start) {
        dr.start = date;
      }
    } else if (type === "start") {
      dr.start = date;
      if (date > dateRange.end) {
        dr.end = date;
      }
    }
    setActiveDatePicker("");
    setDateRange((d) => ({ ...d, ...dr }));
  };

  const handleCompare = () => {
    if (!showCompare) {
      dc = {
        start: dateRange.start,
        end: dateRange.end,
      };
      setDateCompare((d) => ({ ...d, ...dc }));
    }
    setShowCompare(!showCompare);
  };

  const { settings } = global.App;
  const posPickerItems = context.posList
    .filter(({ _id }) => {
      if (global.App.auth.role === "Admin") {
        return true;
      }
      return _id === global.App.auth.registerId;
    })
    .map(({ _id, name, number, type, retailName, tin }) => {
      return {
        key: _id,
        name,
        label: name,
        value: _id,
        number,
        type,
        retailName,
        tin,
        isDefault: _id === global.App.auth.registerId,
      };
    })
    .sort((a, b) => (a.tin > b.tin ? 1 : a.tin < b.tin ? -1 : 0));

  const isMultiplePosSelected = Object.keys(selectedPosIds).length > 1;
  // console.log(context.posList.map(({ _id, type }) => ({ _id, type })));
  const isItakeSelected = context.posList.some(
    (pos) => selectedPosIds[pos._id] && pos.type === "itake"
  );
  // console.log('isItakeSelected', isItakeSelected);
  return (
    <ScrollView style={styles.container} scrollIndicatorInsets={{ right: 1 }}>
      <View style={styles.header}>
        <MultiPicker
          items={posPickerItems}
          onSubmit={(values) => setSelectedPosIds(values)}
          defaultSelectedValues={selectedPosIds}
        />
        {Object.keys(selectedPosIds).length > 1 ? (
          <></>
        ) : (
          <View>
            <Image
              source={require("../assets/images/icon.png")}
              style={styles.logoImage}
            />
          </View>
        )}
      </View>
      <View style={styles.datePickerRow}>
        <Button
          type="solid"
          buttonStyle={{
            backgroundColor: getTheme().themeColor,
            height: isAndroid ? 40 : 45,
          }}
          containerStyle={styles.datePickerButton}
          icon={datePickerButtonIcon}
          onPress={() => setActiveDatePicker("start")}
          title={` ${getDatePrefix(dateRange.start)}`}
        />
        <Button
          type="solid"
          buttonStyle={{
            backgroundColor: getTheme().themeColor,
            height: isAndroid ? 40 : 45,
          }}
          containerStyle={styles.datePickerButton}
          icon={datePickerButtonIcon}
          onPress={() => setActiveDatePicker("end")}
          title={` ${getDatePrefix(dateRange.end)}`}
        />
        <Button
          type="clear"
          buttonStyle={{ height: isAndroid ? 40 : 45 }}
          containerStyle={styles.refreshButton}
          onPress={handleRefresh}
          loading={loading}
          icon={
            <Ionicons name="refresh" size={22} color={getTheme().themeColor} />
          }
        />
        <Button
          type="clear"
          buttonStyle={{ height: isAndroid ? 40 : 45 }}
          containerStyle={styles.refreshButton}
          onPress={handleCompare}
          loading={loading}
          icon={<Ionicons name="eye" size={22} color={getTheme().themeColor} />}
        />
      </View>
      {showCompare && (
        <View style={styles.datePickerCompare}>
          <Button
            type="solid"
            buttonStyle={{
              backgroundColor: getTheme().themeColor,
              height: isAndroid ? 40 : 45,
            }}
            containerStyle={styles.datePickerButton}
            icon={datePickerButtonIcon}
            onPress={() => setActiveDatePicker("start")}
            title={` ${getDatePrefix(dateCompare.start)}`}
          />
          <Button
            type="solid"
            buttonStyle={{
              backgroundColor: getTheme().themeColor,
              height: isAndroid ? 40 : 45,
            }}
            containerStyle={styles.datePickerButton}
            icon={datePickerButtonIcon}
            onPress={() => setActiveDatePicker("end")}
            title={` ${getDatePrefix(dateCompare.end)}`}
          />
        </View>
      )}
      <View>
        <DashboardCard
          color="cadetblue"
          label={global.App.lang.dashboard_total_revenue}
          icon="cash"
          value={`${data.totalRevenue.formatMoney()} ${
            settings.currency.symbol
          }`}
          subvalue={`${
            global.App.lang.dashboard_rounding
          }: ${data.totalRounding.formatMoney()} ${settings.currency.symbol}`}
        />
        <Text style={styles.compare}>abc</Text>
      </View>
      <DashboardCard
        color="orange"
        label={global.App.lang.dashboard_number_of_transactions}
        icon="basket"
        value={data.nTransactions}
      />
      <DashboardCard
        color="orange"
        label={global.App.lang.dashboard_number_of_transactions}
        icon="basket"
        value={data.nTransactionsByPaymentMethod}
      />
      {["bistro", "restaurant"].includes(settings.business_type) &&
        !!data.nOrders && (
          <DashboardCard
            color="firebrick"
            label={global.App.lang.dashboard_order_total}
            icon="cash"
            value={`${
              data.orderTotal
                ? data.orderTotal.formatMoney()
                : Number(0).formatMoney()
            } ${settings.currency.symbol}`}
          />
        )}
      {["bistro", "restaurant"].includes(settings.business_type) &&
        !!data.nOrders && (
          <DashboardCard
            color="indianred"
            label={global.App.lang.dashboard_order_count}
            icon="document"
            value={data.nOrders}
          />
        )}
      <DashboardCard
        color="powderblue"
        label={global.App.lang.dashboard_products_sold}
        icon="gift"
        value={data.nProductsSold}
      />
      {!isMultiplePosSelected && !isItakeSelected && (
        <DashboardCard
          color="royalblue"
          label={global.App.lang.dashboard_revenue_by_group}
          value={data.revenueByGroup}
        />
      )}
      <DashboardCard
        color="crimson"
        label={global.App.lang.dashboard_revenue_by_employee}
        value={data.revenueByEmployee}
      />
      <DashboardCard
        color="palevioletred"
        label={global.App.lang.dashboard_revenue_by_employee_payment_method}
        value={data.revenueByEmployeePaymentMethod}
      />
      <DashboardCard
        color="chocolate"
        label={global.App.lang.dashboard_revenue_by_tax_rates}
        value={data.revenueByTax}
      />
      <DashboardCard
        color="indianred"
        label={global.App.lang.dashboard_revenue_sent_to_ors}
        value={data.revenueByOrs}
      />
      <DashboardCard
        color="tomato"
        label={global.App.lang.dashboard_revenue_by_payment_method}
        value={data.revenueByPaymentMethod}
      />
      {!isMultiplePosSelected && !isItakeSelected && (
        <DashboardCard
          color="skyblue"
          label={
            global.App.lang[
              soldProductListTypes[selectedSoldProductListType].labelKey
            ]
          }
          value={
            data[soldProductListTypes[selectedSoldProductListType].dataKey]
          }
          labelValue={
            selectedSoldProductListType === "profit"
              ? `Σ ${data.totalProductProfit.formatMoney()}`
              : data.topProductsSold.length
          }
          search
          listTypes={soldProductListTypes}
          listType={selectedSoldProductListType}
          onListTypeChange={(type) => {
            if (!global.App.settings.isUsingProfitMonitoring) {
              return Alert.alert(
                global.App.lang.misc_info,
                global.App.lang.misc_inactive_feature
              );
            }
            setSelectedSoldProductListType(type);
          }}
        />
      )}
      {!isMultiplePosSelected && !isItakeSelected && (
        <DashboardCard
          color="olive"
          label={global.App.lang.dashboard_canceled_revenues}
          label2={`Σ ${data.totalCanceled.formatMoney()} ${
            global.App.settings.currency.symbol
          }`}
          value={data.canceledRevenues}
        />
      )}
      <DashboardCard
        color="teal"
        label={global.App.lang.dashboard_canceled_revenues_by_employee}
        value={data.canceledRevenuesByEmloyee}
      />
      {activeDatePicker && (
        <DashboardDateRangePicker
          defaultDateRange={dateRange}
          onChange={handleDatePickerChange(activeDatePicker)}
          label={global.App.lang.misc_date_from}
          part={activeDatePicker}
          onRequestClose={() => setActiveDatePicker("")}
        />
      )}
    </ScrollView>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 10,
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      height: 50,
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
    },
    retailName: {
      fontSize: 24,
      fontWeight: "bold",
    },
    logoImage: {
      width: 40,
      height: 40,
    },
    refreshButton: {
      flexGrow: 1,
      minWidth: 40,
      padding: 1,
      // marginLeft: 'auto',
      // borderWidth: 0.5,
      // borderColor: '#333',
      // backgroundColor: '#999',
    },
    datePickerRow: {
      // backgroundColor: 'red',
      flex: 1,
      flexDirection: "row",
      marginBottom: 5,
    },
    datePickerButton: {
      padding: 1,
      flexGrow: 1,
    },
    datePickerCompare: {
      // backgroundColor: 'red',
      flex: 1,
      flexDirection: "row",
      marginBottom: 5,
    },
    compare: {
      position: "absolute",
      top: "35%",
      left: "50%",
      fontSize: 24,
      fontWeight: "bold",
      color: "#09db4b",
    },
  });

export default DashboardScreen;
